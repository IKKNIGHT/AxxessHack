import React from "react";
import { Dispatch, SetStateAction } from "react";
import { HealthData } from "./types/health";

interface HealthDataFormProps {
  data: HealthData;
  onChange: Dispatch<SetStateAction<HealthData>>;
}

const HealthDataForm: React.FC<HealthDataFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof HealthData, value: number) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const inputStyle =
    "w-full px-5 py-3 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-gray-800 placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200";

  const toggleCard =
    "flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200";

  const sectionTitle =
    "text-3xl font-bold bg-gradient-to-r from-pink-600 via-red-500 to-rose-500 bg-clip-text text-transparent mb-8";

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 p-10 rounded-3xl space-y-16 shadow-xl border border-pink-200">

{/* Demographics */}
<div>
  <h2 className={sectionTitle}>Demographics</h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

    {/* Age */}
    <div>
      <label className="block font-semibold mb-2 text-gray-700">
        Age <span className="text-gray-400">(years)</span>
      </label>
      <input
        type="number"
        value={data.AGE || ""}
        onChange={(e) => handleChange("AGE", Number(e.target.value))}
        className={inputStyle}
      />
    </div>

    {/* Sex */}
    <div>
      <label className="block font-semibold mb-2 text-gray-700">
        Sex
      </label>
      <select
        value={data.SEX || ""}
        onChange={(e) =>
          handleChange("SEX", Number(e.target.value))
        }
        className={inputStyle}
      >
        <option value="">Select</option>
        <option value={1}>Male</option>
        <option value={0}>Female</option>
      </select>
    </div>

    {/* Education */}
    <div>
      <label className="block font-semibold mb-2 text-gray-700">
        Education
      </label>
      <select
        value={data.educ || ""}
        onChange={(e) => handleChange("educ", Number(e.target.value))}
        className={inputStyle}
      >
        <option value="">Select</option>
        <option value={1}>HS or less</option>
        <option value={2}>HS diploma</option>
        <option value={3}>Some college</option>
        <option value={4}>College degree (or higher)</option>
      </select>
    </div>

  </div>
</div>
      {/* Vital Signs */}
      <div>
        <h2 className={sectionTitle}>Vital Signs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Systolic BP <span className="text-gray-400">(mmHg)</span>
            </label>
            <input
              type="number"
              value={data.SYSBP || ""}
              onChange={(e) => handleChange("SYSBP", Number(e.target.value))}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Diastolic BP <span className="text-gray-400">(mmHg)</span>
            </label>
            <input
              type="number"
              value={data.DIABP || ""}
              onChange={(e) => handleChange("DIABP", Number(e.target.value))}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Heart Rate <span className="text-gray-400">(bpm)</span>
            </label>
            <input
              type="number"
              value={data.HEARTRTE || ""}
              onChange={(e) => handleChange("HEARTRTE", Number(e.target.value))}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              BMI <span className="text-gray-400">(kg/m²)</span>
            </label>
            <input
              type="number"
              value={data.BMI || ""}
              onChange={(e) => handleChange("BMI", Number(e.target.value))}
              className={inputStyle}
            />
          </div>

        </div>
      </div>

      {/* Laboratory Values */}
      <div>
        <h2 className={sectionTitle}>Laboratory Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {[
            { label: "Total Cholesterol", key: "TOTCHOL", unit: "mg/dL" },
            { label: "HDL Cholesterol", key: "HDLC", unit: "mg/dL" },
            { label: "LDL Cholesterol", key: "LDLC", unit: "mg/dL" },
            { label: "Glucose", key: "GLUCOSE", unit: "mg/dL" },
          ].map((item) => (
            <div key={item.key}>
              <label className="block font-semibold mb-2 text-gray-700">
                {item.label}{" "}
                <span className="text-gray-400">({item.unit})</span>
              </label>
              <input
                type="number"
                value={data[item.key as keyof HealthData] || ""}
                onChange={(e) =>
                  handleChange(
                    item.key as keyof HealthData,
                    Number(e.target.value)
                  )
                }
                className={inputStyle}
              />
            </div>
          ))}

        </div>
      </div>

      {/* Lifestyle */}
      <div>
        <h2 className={sectionTitle}>Lifestyle Factors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Current Smoker */}
          <div className={toggleCard}>
            <span className="font-semibold text-gray-700">Current Smoker</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!data.CURSMOKE}
                onChange={(e) =>
                  handleChange("CURSMOKE", e.target.checked ? 1 : 0)
                }
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                  data.CURSMOKE ? "bg-pink-600" : "bg-pink-200"
                }`}
              ></div>
              <div
                className={`absolute left-0 top-0 w-5 h-5 bg-white border border-pink-300 rounded-full shadow transform transition-transform duration-300 ${
                  data.CURSMOKE ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </label>
          </div>

          {/* Cigarettes per Day */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Cigarettes per Day{" "}
              <span className="text-gray-400">(cigarettes)</span>
            </label>
            <input
              type="number"
              value={data.CIGPDAY || ""}
              onChange={(e) =>
                handleChange("CIGPDAY", Number(e.target.value))
              }
              className={inputStyle}
            />
          </div>

        </div>
      </div>

      {/* Medications */}
      <div>
        <h2 className={sectionTitle}>Medications</h2>
        <div className={toggleCard}>
          <span className="font-semibold text-gray-700">BP Medication</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!data.BPMEDS}
              onChange={(e) =>
                handleChange("BPMEDS", e.target.checked ? 1 : 0)
              }
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                data.BPMEDS ? "bg-pink-600" : "bg-pink-200"
              }`}
            ></div>
            <div
              className={`absolute left-0 top-0 w-5 h-5 bg-white border border-pink-300 rounded-full shadow transform transition-transform duration-300 ${
                data.BPMEDS ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </label>
        </div>
      </div>

      {/* Medical History */}
      <div>
        <h2 className={sectionTitle}>Medical History</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {[
            { label: "Diabetes", key: "DIABETES" },
            { label: "Hypertension", key: "HYPERTEN" },
            { label: "Previous CHD", key: "PREVCHD" },
            { label: "Previous Angina", key: "PREVAP" },
            { label: "Previous MI", key: "PREVMI" },
            { label: "Previous Stroke", key: "PREVSTRK" },
          ].map((item) => (
            <div key={item.key} className={toggleCard}>
              <span className="font-semibold text-gray-700">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!data[item.key as keyof HealthData]}
                  onChange={(e) =>
                    handleChange(
                      item.key as keyof HealthData,
                      e.target.checked ? 1 : 0
                    )
                  }
                  className="sr-only"
                />
                <div
                  className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                    data[item.key as keyof HealthData] ? "bg-pink-600" : "bg-pink-200"
                  }`}
                ></div>
                <div
                  className={`absolute left-0 top-0 w-5 h-5 bg-white border border-pink-300 rounded-full shadow transform transition-transform duration-300 ${
                    data[item.key as keyof HealthData] ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </label>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default HealthDataForm;