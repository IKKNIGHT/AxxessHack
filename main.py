import pandas as pd
import joblib
from flask import Flask, request, render_template_string

app = Flask(__name__)

# Load the artifacts created by train.py
try:
    model = joblib.load("framingham_rf_model.pkl")
    saved_features = joblib.load("feature_names.pkl")
    print("Model and features loaded into memory.")
except FileNotFoundError:
    print("Error: Pickle files not found. Run train.py first!")
    exit()

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Framingham CVD Predictor</title>
    <style>
        body { font-family: sans-serif; margin: 40px; background-color: #f4f4f9; }
        form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; }
        input { margin-bottom: 10px; width: 100%; padding: 8px; box-sizing: border-box; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        .result { margin-top: 20px; padding: 15px; border-radius: 5px; background: #e7f3ff; }
    </style>
</head>
<body>
    <h2>CVD 10-Year Risk Predictor</h2>
    <form method="POST">
        {% for feat in features %}
            <label>{{ feat }}:</label>
            <input type="number" step="any" name="{{ feat }}" required>
        {% endfor %}
        <button type="submit">Calculate Risk</button>
    </form>

    {% if probability %}
        <div class="result">
            <h3>Probability: {{ probability }}%</h3>
            <h3>Risk Category: {{ risk }}</h3>
        </div>
    {% endif %}
</body>
</html>
"""


@app.route("/", methods=["GET", "POST"])
def predict():
    probability = None
    risk = None

    if request.method == "POST":
        try:
            # Dynamically build input dict based on saved features
            input_dict = {feat: [float(request.form[feat])] for feat in saved_features}
            input_df = pd.DataFrame(input_dict)

            # Ensure column order matches training exactly
            input_df = input_df[saved_features]

            prob = model.predict_proba(input_df)[0][1]
            probability = round(prob * 100, 2)

            if probability < 10:
                risk = "Low Risk"
            elif probability < 20:
                risk = "Moderate Risk"
            else:
                risk = "High Risk"

        except Exception as e:
            return f"<h3>Error: {e}</h3>"

    return render_template_string(HTML_TEMPLATE, features=saved_features, probability=probability, risk=risk)


if __name__ == "__main__":
    app.run(debug=True)