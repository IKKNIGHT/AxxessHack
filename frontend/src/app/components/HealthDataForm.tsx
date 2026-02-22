import React from 'react';

interface HealthDataFormProps {
  onSubmit?: (data: any) => void;
  initialData?: any;
}

const HealthDataForm: React.FC<HealthDataFormProps> = ({ onSubmit, initialData }) => {
  return (
    <div className="p-6 border rounded-lg">
      <p className="text-gray-600">Health Data Form</p>
      <form className="mt-4 space-y-4">
        <input 
          type="text" 
          placeholder="Enter health data" 
          className="w-full p-2 border rounded"
        />
      </form>
    </div>
  );
};

export default HealthDataForm;
