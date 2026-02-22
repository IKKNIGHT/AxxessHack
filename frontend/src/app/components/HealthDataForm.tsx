import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { HealthData } from './types/health';

interface HealthDataFormProps {
  data: HealthData;
  onChange: Dispatch<SetStateAction<HealthData>>;
}

const HealthDataForm: React.FC<HealthDataFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof HealthData, value: any) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Health Data Form</h3>
      <form className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input 
            type="number" 
            placeholder="Age (years)"
            value={data.AGE || ''}
            onChange={(e) => handleChange('AGE', Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sex</label>
          <select 
            value={data.SEX || ''}
            onChange={(e) => handleChange('SEX', Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Sex</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
          <input 
            type="number" 
            placeholder="Heart rate"
            value={data.HEARTRTE || ''}
            onChange={(e) => handleChange('HEARTRTE', Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Systolic BP (mmHg)</label>
          <input 
            type="number" 
            placeholder="Systolic BP"
            value={data.SYSBP || ''}
            onChange={(e) => handleChange('SYSBP', Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Diastolic BP (mmHg)</label>
          <input 
            type="number" 
            placeholder="Diastolic BP"
            value={data.DIABP || ''}
            onChange={(e) => handleChange('DIABP', Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Cholesterol (mg/dL)</label>
          <input 
            type="number" 
            placeholder="Total cholesterol"
            value={data.TOTCHOL || ''}
            onChange={(e) => handleChange('TOTCHOL', Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
      </form>
    </div>
  );
};

export default HealthDataForm;
