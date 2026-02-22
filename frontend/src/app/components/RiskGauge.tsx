import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface RiskGaugeProps {
  probability?: number;
  risk?: string;
  percentage?: number;
  size?: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({
  probability = 0,
  risk = "Low Risk",
  percentage = 0,
  size = 200,
}) => {
  const displayPercentage = percentage || probability;

  const getRiskLevel = (pct: number) => {
    if (pct < 10) return { label: "Low", color: "#22c55e", bgColor: "#dcfce7", emoji: "💚" };
    if (pct < 20) return { label: "Moderate", color: "#f59e0b", bgColor: "#fef3c7", emoji: "💛" };
    if (pct < 30) return { label: "High", color: "#f97316", bgColor: "#fed7aa", emoji: "🧡" };
    return { label: "Very High", color: "#ef4444", bgColor: "#fee2e2", emoji: "❤️" };
  };

  const riskLevel = getRiskLevel(displayPercentage);
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ backgroundColor: riskLevel.color }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <svg width={size} height={size} className="transform -rotate-90 relative z-10">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fce4ec" />
              <stop offset="100%" stopColor="#f8bbd0" />
            </linearGradient>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={riskLevel.color} />
              <stop offset="100%" stopColor={riskLevel.color} stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#bgGradient)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Animated progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#riskGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${riskLevel.color})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            {/* Beating heart */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart
                className="w-16 h-16 mx-auto mb-2"
                fill={riskLevel.color}
                color={riskLevel.color}
                style={{ filter: `drop-shadow(0 4px 12px ${riskLevel.color}40)` }}
              />
            </motion.div>

            <div className="text-5xl font-bold" style={{ color: riskLevel.color }}>
              {displayPercentage}%
            </div>
            <div className="text-sm text-gray-600 mt-1 font-medium">10-year risk</div>
          </motion.div>
        </div>
      </div>

      {/* Risk label badge */}
      <motion.div
        className="px-6 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2"
        style={{ backgroundColor: riskLevel.bgColor, color: riskLevel.color }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
      >
        <span className="text-xl">{riskLevel.emoji}</span>
        {riskLevel.label} Risk
      </motion.div>
    </div>
  );
};

export default RiskGauge;