# %% [markdown]
# ## Imports dependencies

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score
from imblearn.over_sampling import SMOTE
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.ensemble import GradientBoostingClassifier
from xgboost import XGBClassifier
from catboost import CatBoostClassifier

import warnings

warnings.filterwarnings('ignore')

# %% [markdown]
# ## Load dataset

df = pd.read_csv('database/Framingham Dataset.csv')

# %% [markdown]
# ## EDA and Preprocessing

df.shape

df.head()

df.describe().T

# Information about the data
df.info()

df.isnull().sum()


# Impute missing values with the median value
def impute_median(data):
    return data.fillna(data.median())


df.TOTCHOL = df['TOTCHOL'].transform(impute_median)
df.CIGPDAY = df['CIGPDAY'].transform(impute_median)
df.BMI = df['BMI'].transform(impute_median)
df.BPMEDS = df['BPMEDS'].transform(impute_median)
df.HEARTRTE = df['HEARTRTE'].transform(impute_median)
df.GLUCOSE = df['GLUCOSE'].transform(impute_median)
df.educ = df['educ'].transform(impute_median)
df.HDLC = df['HDLC'].transform(impute_median)
df.LDLC = df['LDLC'].transform(impute_median)

df.isnull().sum()

# %% [markdown]
# ## Data Visualisation

var_cat = ['SEX', 'CURSMOKE', 'DIABETES', 'BPMEDS', 'educ', 'PREVCHD', 'PREVAP',
           'PREVMI', 'PREVSTRK', 'PREVHYP', 'PERIOD', 'DEATH', 'ANGINA', 'HOSPMI',
           'MI_FCHD', 'ANYCHD', 'STROKE', 'CVD', 'HYPERTEN']

fig, ax = plt.subplots(13, 3, figsize=(16, 32))

i = 0
j = 0
for var in df.columns:
    if var in var_cat:
        sns.countplot(x=var, data=df, color='skyblue', ax=ax[i, j])
    else:
        sns.histplot(df[var], bins=40, kde=True, color='skyblue', edgecolor='black', ax=ax[i, j])
    ax[i, j].set_title(var)
    ax[i, j].set_xlabel(var)
    ax[i, j].set_ylabel('Count')

    if j == 2:
        j = 0
        i += 1
    else:
        j += 1

plt.tight_layout()
plt.show()


# Correlation matrix
plt.figure(figsize=(12, 8))
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, cmap='coolwarm')
plt.title('Matriz de Correlación')
plt.show()

df.corr()['CVD']

# %% [markdown]
# ## Models

# %% [code]
# Split data into features and target
X = df.drop(['CVD'], axis=1)
y = df['CVD']

# %% [code]
# Split data into training and testing sets
smote = SMOTE(sampling_strategy='auto', random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=1234)

# %% [code]
# Instantiate classification models
models = {
    'Decision Tree': DecisionTreeClassifier(max_depth=20),
    'Random Forest': RandomForestClassifier(n_estimators=400, random_state=42),
    'K-Nearest Neighbors': KNeighborsClassifier(n_neighbors=2),
    'AdaBoost': AdaBoostClassifier(),
    'Gradient Boosting': GradientBoostingClassifier(),
    'XGBoost': XGBClassifier(n_estimators=350),
    'CatBoost': CatBoostClassifier(verbose=0)
}

# Fit models and generate classification reports
accuracy = []
precision = []
recall = []
f1 = []

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    accuracy.append(accuracy_score(y_test, y_pred))
    precision.append(precision_score(y_test, y_pred, average='weighted'))
    recall.append(recall_score(y_test, y_pred, average='weighted'))
    f1.append(f1_score(y_test, y_pred, average='weighted'))

    report = classification_report(y_test, y_pred)
    print(f'{name} Classification Report:\n{report}\n')

# %% [code]
d = {'Models': list(models.keys()), 'Accuracy': accuracy, 'Precision': precision, 'Recall': recall, 'F1 Score': f1}


# Function to add values on top of bars
def add_values_on_bars(ax, values):
    for i, value in enumerate(values):
        ax.text(i, value + 0.01, f'{value:.2f}', ha='center', va='bottom')


# Create the bar plots
fig, ax = plt.subplots(2, 2, figsize=(16, 16))

sns.barplot(x='Models', y='Accuracy', data=d, ax=ax[0, 0], color='skyblue')
add_values_on_bars(ax[0, 0], accuracy)
ax[0, 0].set_title('Model Accuracy Comparison')
ax[0, 0].set_xlabel('Accuracy')
ax[0, 0].set_ylabel('Model')
ax[0, 0].tick_params(axis='x', rotation=45)

sns.barplot(x='Models', y='Precision', data=d, ax=ax[0, 1], color='skyblue')
add_values_on_bars(ax[0, 1], precision)
ax[0, 1].set_title('Model Precision Comparison')
ax[0, 1].set_xlabel('Precision')
ax[0, 1].set_ylabel('Model')
ax[0, 1].tick_params(axis='x', rotation=45)

sns.barplot(x='Models', y='Recall', data=d, ax=ax[1, 0], color='skyblue')
add_values_on_bars(ax[1, 0], recall)
ax[1, 0].set_title('Model Recall Comparison')
ax[1, 0].set_xlabel('Recall')
ax[1, 0].set_ylabel('Model')
ax[1, 0].tick_params(axis='x', rotation=45)

sns.barplot(x='Models', y='F1 Score', data=d, ax=ax[1, 1], color='skyblue')
add_values_on_bars(ax[1, 1], f1)
ax[1, 1].set_title('Model F1 Score Comparison')
ax[1, 1].set_xlabel('F1 Score')
ax[1, 1].set_ylabel('Model')
ax[1, 1].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.show()