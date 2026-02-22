import { HealthData } from "../types/health";

export const DEFAULT_HEALTH_DATA: HealthData = {
  SEX: 1,
  TOTCHOL: 200,
  AGE: 50,
  SYSBP: 120,
  DIABP: 80,
  CURSMOKE: 0,
  CIGPDAY: 0,
  BMI: 25,
  DIABETES: 0,
  BPMEDS: 0,
  HEARTRTE: 70,
  GLUCOSE: 100,
  educ: 1,
  PREVCHD: 0,
  PREVAP: 0,
  PREVMI: 0,
  PREVSTRK: 0,
  PREVHYP: 0,
  PERIOD: 0,
  HDLC: 50,
  LDLC: 130,
  HYPERTEN: 0,
};

// Mock API call to CVD prediction backend
export async function predictCVDRisk(healthData: HealthData): Promise<number> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // TODO: Replace with actual backend endpoint
  // const response = await fetch('YOUR_BACKEND_URL/predict', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(healthData),
  // });
  // const data = await response.json();
  // return data.riskPercentage;

  // Mock calculation for demonstration
  let risk = 0;

  // Age factor
  if (healthData.AGE > 60) risk += 15;
  else if (healthData.AGE > 50) risk += 10;
  else if (healthData.AGE > 40) risk += 5;

  // Cholesterol factor
  if (healthData.TOTCHOL > 240) risk += 10;
  else if (healthData.TOTCHOL > 200) risk += 5;

  // Blood pressure factor
  if (healthData.SYSBP > 140) risk += 10;
  else if (healthData.SYSBP > 130) risk += 5;

  // Smoking factor
  if (healthData.CURSMOKE === 1) risk += 15;

  // BMI factor
  if (healthData.BMI > 30) risk += 10;
  else if (healthData.BMI > 25) risk += 5;

  // Diabetes factor
  if (healthData.DIABETES === 1) risk += 12;

  // Previous conditions
  if (healthData.PREVCHD === 1) risk += 20;
  if (healthData.PREVMI === 1) risk += 20;
  if (healthData.PREVSTRK === 1) risk += 15;
  if (healthData.PREVHYP === 1) risk += 8;

  // HDL/LDL ratio
  if (healthData.HDLC < 40) risk += 5;
  if (healthData.LDLC > 160) risk += 8;

  // Cap at 99%
  return Math.min(risk, 99);
}

// Parse Apple Health XML data
export function parseAppleHealthXML(xmlContent: string): Partial<HealthData> | null {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    // Check for parsing errors
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      throw new Error("Invalid XML format");
    }

    const records = xmlDoc.querySelectorAll("Record");
    const healthData: Partial<HealthData> = {};

    // Map Apple Health record types to our health data fields
    const typeMapping: Record<string, string> = {
      "HKQuantityTypeIdentifierBodyMass": "weight",
      "HKQuantityTypeIdentifierHeight": "height",
      "HKQuantityTypeIdentifierHeartRate": "HEARTRTE",
      "HKQuantityTypeIdentifierBloodPressureSystolic": "SYSBP",
      "HKQuantityTypeIdentifierBloodPressureDiastolic": "DIABP",
      "HKQuantityTypeIdentifierBodyMassIndex": "BMI",
      "HKQuantityTypeIdentifierBloodGlucose": "GLUCOSE",
    };

    let weight = 0;
    let height = 0;

    records.forEach((record) => {
      const type = record.getAttribute("type");
      const value = parseFloat(record.getAttribute("value") || "0");

      if (type && typeMapping[type]) {
        const field = typeMapping[type];
        if (field === "weight") {
          weight = value;
        } else if (field === "height") {
          height = value;
        } else {
          (healthData as any)[field] = Math.round(value);
        }
      }
    });

    // Calculate BMI if we have weight and height
    if (weight > 0 && height > 0) {
      healthData.BMI = Math.round((weight / (height * height)) * 10000) / 10;
    }

    return healthData;
  } catch (error) {
    console.error("Error parsing Apple Health XML:", error);
    return null;
  }
}
