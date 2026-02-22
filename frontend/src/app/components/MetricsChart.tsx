import React from 'react';

interface MetricsChartProps {
  assessments?: any[];
  metric?: string;
  title?: string;
  unit?: string;
  color?: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ 
  assessments = [], 
  metric,
  title,
  unit,
  color
}) => {
  return (
    <div className="p-6">
      <div className="bg-gray-100 p-12 rounded-lg text-center">
        <p className="text-gray-600">{title || 'Metrics Chart'}</p>
        {assessments.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {assessments.length} assessment(s) loaded
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricsChart;
