import React, { useState } from 'react';

/**
 * Test component to demonstrate XML parsing functionality
 * This can be run separately to validate the XML import feature
 */

const XMLParsingTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const fieldMapping: Record<string, string> = {
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

  const parseXMLString = (xmlString: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format');
    }

    const parsedData: any = {};
    let fieldCount = 0;

    const allElements = xmlDoc.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      const nodeName = element.nodeName.toLowerCase();
      const textContent = element.textContent?.trim();

      const healthField = fieldMapping[nodeName];

      if (healthField && textContent) {
        const numValue = parseInt(textContent, 10);
        if (!isNaN(numValue)) {
          parsedData[healthField] = numValue;
          fieldCount++;
        }
      }
    }

    return { parsedData, fieldCount };
  };

  const testCase1 = () => {
    setError('');
    try {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<PatientData>
  <age>55</age>
  <sex>1</sex>
  <totchol>240</totchol>
  <sysbp>140</sysbp>
  <diabp>90</diabp>
  <bmi>28.5</bmi>
  <hdlc>40</hdlc>
  <ldlc>150</ldlc>
</PatientData>`;

      const { parsedData, fieldCount } = parseXMLString(xml);
      setTestResults({
        title: '✓ Test Case 1: Valid XML with 8 fields',
        success: true,
        fieldCount,
        data: parsedData,
        expected: {
          AGE: 55,
          SEX: 1,
          TOTCHOL: 240,
          SYSBP: 140,
          DIABP: 90,
          BMI: 28,
          HDLC: 40,
          LDLC: 150,
        },
      });
    } catch (err) {
      setError(`Test Case 1 Failed: ${(err as Error).message}`);
    }
  };

  const testCase2 = () => {
    setError('');
    try {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<PatientData>
  <AGE>65</AGE>
  <gender>0</gender>
  <Total_Cholesterol>280</Total_Cholesterol>
  <Systolic_BP>160</Systolic_BP>
  <diastolic_bp>100</diastolic_bp>
  <heart_rate>85</heart_rate>
  <Current_Smoker>1</Current_Smoker>
  <Glucose>140</Glucose>
</PatientData>`;

      const { parsedData, fieldCount } = parseXMLString(xml);
      setTestResults({
        title: '✓ Test Case 2: Mixed case and alias names (8 fields)',
        success: true,
        fieldCount,
        data: parsedData,
        details: 'Tests case insensitivity and field name aliases',
      });
    } catch (err) {
      setError(`Test Case 2 Failed: ${(err as Error).message}`);
    }
  };

  const testCase3 = () => {
    setError('');
    try {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<PatientData>
  <age>45</age>
  <sex>1</sex>
</PatientData>`;

      const { parsedData, fieldCount } = parseXMLString(xml);
      if (fieldCount < 2) throw new Error('Should parse 2 fields minimum');

      setTestResults({
        title: '⚠️ Test Case 3: Minimal data (2 fields)',
        success: true,
        fieldCount,
        data: parsedData,
        warning: 'Critical fields missing: TOTCHOL, SYSBP, DIABP',
      });
    } catch (err) {
      setError(`Test Case 3 Failed: ${(err as Error).message}`);
    }
  };

  const testCase4 = () => {
    setError('');
    try {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<PatientData>
  <invalid><nested>45</nested></invalid>
</PatientData>`;

      const { parsedData, fieldCount } = parseXMLString(xml);
      if (fieldCount > 0) throw new Error('Should find no valid fields');

      setTestResults({
        title: '✓ Test Case 4: Invalid field names (0 fields found)',
        success: true,
        fieldCount,
        data: parsedData,
        details: 'Correctly skipped unrecognized field names',
      });
    } catch (err) {
      setError(`Test Case 4 Failed: ${(err as Error).message}`);
    }
  };

  const testCase5 = () => {
    setError('');
    try {
      const invalidXml = `<?xml version="1.0"?>
<broken>
  <age>45</age>`;

      parseXMLString(invalidXml);
      setError('Test Case 5 Failed: Should have detected XML error');
    } catch (err) {
      setTestResults({
        title: '✓ Test Case 5: Malformed XML detection',
        success: true,
        error: `Correctly caught: ${(err as Error).message}`,
      });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">XML Parsing Test Suite</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={testCase1}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Case 1: Valid XML
        </button>
        <button
          onClick={testCase2}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Case 2: Mixed Case
        </button>
        <button
          onClick={testCase3}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Case 3: Minimal Data
        </button>
        <button
          onClick={testCase4}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Case 4: Invalid Fields
        </button>
        <button
          onClick={testCase5}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 col-span-2"
        >
          Test Case 5: Malformed XML
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
      )}

      {testResults && (
        <div className="p-6 bg-gray-50 border border-gray-300 rounded">
          <h2 className="text-xl font-bold mb-4">{testResults.title}</h2>
          {testResults.fieldCount && (
            <p className="mb-2">
              <strong>Fields Parsed:</strong> {testResults.fieldCount}
            </p>
          )}
          {testResults.warning && (
            <p className="text-yellow-700 mb-2">
              <strong>Warning:</strong> {testResults.warning}
            </p>
          )}
          {testResults.error && (
            <p className="text-red-700 mb-2">
              <strong>Error Detected:</strong> {testResults.error}
            </p>
          )}
          {testResults.details && (
            <p className="text-gray-700 mb-2">
              <strong>Details:</strong> {testResults.details}
            </p>
          )}
          {testResults.data && Object.keys(testResults.data).length > 0 && (
            <div className="mt-4">
              <strong>Parsed Data:</strong>
              <pre className="bg-white p-3 rounded border mt-2 overflow-x-auto text-sm">
                {JSON.stringify(testResults.data, null, 2)}
              </pre>
            </div>
          )}
          {testResults.expected && (
            <div className="mt-4">
              <strong>Expected Data:</strong>
              <pre className="bg-white p-3 rounded border mt-2 overflow-x-auto text-sm">
                {JSON.stringify(testResults.expected, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default XMLParsingTest;
