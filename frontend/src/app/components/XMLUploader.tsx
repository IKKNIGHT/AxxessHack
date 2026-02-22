import React from 'react';
import { HealthData } from './types/health';

interface XMLUploaderProps {
  onDataParsed: (parsedData: Partial<HealthData>) => void;
}

const XMLUploader: React.FC<XMLUploaderProps> = ({ onDataParsed }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const xmlString = event.target?.result as string;
          // Parse XML and extract data
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
          
          // Basic parsing example - customize based on your XML structure
          const parsedData: Partial<HealthData> = {};
          onDataParsed(parsedData);
        } catch (error) {
          console.error('Error parsing XML:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <label className="block text-gray-600 mb-4">
        Upload XML File
        <input 
          type="file" 
          accept=".xml"
          onChange={handleFileUpload}
          className="ml-4"
        />
      </label>
    </div>
  );
};

export default XMLUploader;
