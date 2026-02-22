export interface HealthData {
  SEX: number; // 1 = Male, 2 = Female
  TOTCHOL: number; // Total cholesterol (mg/dL)
  AGE: number; // Age in years
  SYSBP: number; // Systolic blood pressure (mmHg)
  DIABP: number; // Diastolic blood pressure (mmHg)
  CURSMOKE: number; // Current smoker (0 = No, 1 = Yes)
  CIGPDAY: number; // Cigarettes per day
  BMI: number; // Body Mass Index
  DIABETES: number; // Diabetes (0 = No, 1 = Yes)
  BPMEDS: number; // Blood pressure medication (0 = No, 1 = Yes)
  HEARTRTE: number; // Heart rate (bpm)
  GLUCOSE: number; // Glucose level (mg/dL)
  educ: number; // Education level (1-4)
  PREVCHD: number; // Previous coronary heart disease (0 = No, 1 = Yes)
  PREVAP: number; // Previous angina pectoris (0 = No, 1 = Yes)
  PREVMI: number; // Previous myocardial infarction (0 = No, 1 = Yes)
  PREVSTRK: number; // Previous stroke (0 = No, 1 = Yes)
  PREVHYP: number; // Previous hypertension (0 = No, 1 = Yes)
  PERIOD: number; // Period
  HDLC: number; // HDL cholesterol (mg/dL)
  LDLC: number; // LDL cholesterol (mg/dL)
  HYPERTEN: number; // Hypertension (0 = No, 1 = Yes)
}

export interface AssessmentResult {
  id: string;
  date: string;
  healthData: HealthData;
  riskPercentage: number;
  riskLevel: "Low" | "Moderate" | "High" | "Very High";
}
