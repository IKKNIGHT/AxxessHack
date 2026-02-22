import React from 'react';

interface RiskGaugeProps {
  probability?: number;
  risk?: string;
  percentage?: number;
  size?: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ 
  probability = 0, 
  risk = 'Low Risk',
  percentage = 0,
  size = 128
}) => {
  const displayPercentage = percentage || probability;
  
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div 
        className="relative rounded-full flex items-center justify-center border-8 border-gray-300"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(rgb(34, 197, 94) 0deg, rgb(250, 204, 21) ${displayPercentage * 3.6}deg, rgb(209, 213, 219) ${displayPercentage * 3.6}deg)`
        }}>
        <div 
          className="absolute rounded-full bg-white flex flex-col items-center justify-center"
          style={{
            width: size - 20,
            height: size - 20
          }}>
          <div className="text-2xl font-bold">{displayPercentage}%</div>
          <div className="text-sm text-gray-600">{risk}</div>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
