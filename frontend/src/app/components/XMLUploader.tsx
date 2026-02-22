import React, { useState } from 'react';
import { HealthData } from './types/health';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface XMLUploaderProps {
  onDataParsed: (parsedData: Partial<HealthData>) => void;
}

const XMLUploader: React.FC<XMLUploaderProps> = ({ onDataParsed }) => {
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // XML Element to HealthData field mapping
  const fieldMapping: Record<string, keyof HealthData> = {
    'age': 'AGE',
    'sex': 'SEX',
    'gender': 'SEX',
    'totchol': 'TOTCHOL',
    'total_cholesterol': 'TOTCHOL',
    'sysbp': 'SYSBP',
    'systolic_bp': 'SYSBP',
    'diabp': 'DIABP',
    'diastolic_bp': 'DIABP',
    'cursmoke': 'CURSMOKE',
    'current_smoker': 'CURSMOKE',
    'cigpday': 'CIGPDAY',
    'cigarettes_per_day': 'CIGPDAY',
    'bmi': 'BMI',
    'diabetes': 'DIABETES',
    'bpmeds': 'BPMEDS',
    'bp_medications': 'BPMEDS',
    'heartrte': 'HEARTRTE',
    'heart_rate': 'HEARTRTE',
    'glucose': 'GLUCOSE',
    'blood_glucose': 'GLUCOSE',
    'educ': 'educ',
    'education': 'educ',
    'prevchd': 'PREVCHD',
    'previous_chd': 'PREVCHD',
    'prevap': 'PREVAP',
    'previous_angina': 'PREVAP',
    'prevmi': 'PREVMI',
    'previous_mi': 'PREVMI',
    'prevstrk': 'PREVSTRK',
    'previous_stroke': 'PREVSTRK',
    'prevhyp': 'PREVHYP',
    'previous_hypertension': 'PREVHYP',
    'period': 'PERIOD',
    'hdlc': 'HDLC',
    'hdl_cholesterol': 'HDLC',
    'ldlc': 'LDLC',
    'ldl_cholesterol': 'LDLC',
    'hyperten': 'HYPERTEN',
    'hypertension': 'HYPERTEN',
  };

  const parseXMLToNumber = (value: string | null | undefined, fieldName: string): number | undefined => {
    if (!value) return undefined;
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      console.warn(`Invalid number for field ${fieldName}: ${value}`);
      return undefined;
    }
    return num;
  };

  const parseXMLString = (value: string | null | undefined): string | undefined => {
    return value?.trim() || undefined;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const xmlString = event.target?.result as string;

        // Check for XML errors
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
          throw new Error('Invalid XML format');
        }

        const parsedData: Partial<HealthData> = {};
        let fieldCount = 0;

        // Parse all elements in the XML
        const allElements = xmlDoc.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) {
          const element = allElements[i];
          const nodeName = element.nodeName.toLowerCase();
          const textContent = element.textContent?.trim();

          // Look for matching field in mapping
          const healthField = fieldMapping[nodeName];

          if (healthField && textContent) {
            const numValue = parseXMLToNumber(textContent, nodeName);
            if (numValue !== undefined) {
              (parsedData as any)[healthField] = numValue;
              fieldCount++;
            }
          }
        }

        if (fieldCount === 0) {
          throw new Error('No valid health data fields found in XML');
        }

        // Validate critical fields
        const criticalFields = ['AGE', 'SEX', 'TOTCHOL', 'SYSBP', 'DIABP'];
        const missingCritical = criticalFields.filter(
          (field) => !(field in parsedData)
        );

        if (missingCritical.length > 0) {
          console.warn(`Missing critical fields: ${missingCritical.join(', ')}`);
          toast.warning(
            `⚠️ Missing some fields: ${missingCritical.join(', ')}. Please manually enter them.`,
            { duration: 5 }
          );
        }

        onDataParsed(parsedData);
        toast.success(
          `✓ Successfully imported ${fieldCount} health data fields from ${file.name}`,
          { duration: 3 }
        );
      } catch (error) {
        console.error('Error parsing XML:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to parse XML file';
        toast.error(`❌ ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Upload Patient Health Data (XML Format)
        </label>

        <div className="relative">
          <input
            type="file"
            accept=".xml"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="hidden"
            id="xml-upload"
          />
          <label
            htmlFor="xml-upload"
            className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
              isLoading
                ? 'bg-blue-50 border-blue-300'
                : 'bg-pink-50 border-pink-300 hover:border-pink-500 hover:bg-pink-100'
            }`}
          >
            <Upload className="w-5 h-5 text-pink-600" />
            <div>
              <p className="font-semibold text-gray-800">
                {isLoading ? 'Processing...' : 'Click to upload XML file'}
              </p>
              <p className="text-sm text-gray-600">
                {fileName || 'or drag and drop'}
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* XML Structure Reference */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
      >
        <div className="flex gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <h3 className="font-semibold text-blue-900">XML Structure Guide</h3>
        </div>
        <details className="text-sm text-blue-800">
          <summary className="cursor-pointer font-medium mb-3 hover:text-blue-900">
            📋 View example XML structure
          </summary>
          <pre className="bg-white p-3 rounded border border-blue-200 text-xs overflow-x-auto font-mono">
{`<?xml version="1.0" encoding="UTF-8"?>
<PatientData>
  <age>55</age>
  <sex>1</sex>
  <totchol>240</totchol>
  <sysbp>140</sysbp>
  <diabp>90</diabp>
  <cursmoke>0</cursmoke>
  <cigpday>0</cigpday>
  <bmi>28.5</bmi>
  <diabetes>0</diabetes>
  <bpmeds>1</bpmeds>
  <heartrte>72</heartrte>
  <glucose>100</glucose>
  <educ>4</educ>
  <prevchd>0</prevchd>
  <prevap>0</prevap>
  <prevmi>0</prevmi>
  <prevstrk>0</prevstrk>
  <prevhyp>1</prevhyp>
  <period>1</period>
  <hdlc>40</hdlc>
  <ldlc>150</ldlc>
  <hyperten>1</hyperten>
</PatientData>`}
          </pre>
          <div className="mt-3 space-y-1 text-xs">
            <p className="font-semibold">Field Reference:</p>
            <ul className="ml-3 space-y-1">
              <li>• <span className="font-mono">age</span>: Age in years (18-100)</li>
              <li>• <span className="font-mono">sex</span>: 1=Male, 0=Female</li>
              <li>• <span className="font-mono">totchol</span>: Total cholesterol (mg/dL)</li>
              <li>• <span className="font-mono">sysbp</span>: Systolic BP (mmHg)</li>
              <li>• <span className="font-mono">diabp</span>: Diastolic BP (mmHg)</li>
              <li>• <span className="font-mono">cursmoke</span>: Current smoker 0/1</li>
              <li>• <span className="font-mono">bmi</span>: Body Mass Index</li>
              <li>• <span className="font-mono">diabetes</span>: Diabetes 0/1</li>
              <li>• <span className="font-mono">hdlc</span>: HDL cholesterol (mg/dL)</li>
              <li>• <span className="font-mono">ldlc</span>: LDL cholesterol (mg/dL)</li>
            </ul>
          </div>
        </details>
      </motion.div>
    </motion.div>
  );
};

export default XMLUploader;
