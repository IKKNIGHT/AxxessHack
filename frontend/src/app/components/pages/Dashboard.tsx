import { useNavigate } from "react-router";
import { Activity, TrendingUp, Heart, AlertCircle, Calendar, ArrowRight, Sparkles, HeartPulse, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { getLatestAssessment, getAssessments } from "../utils/storage";
import RiskGauge from "../RiskGauge";
import MetricsChart from "../MetricsChart";
import { motion } from "motion/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const latestAssessment = getLatestAssessment();
  const assessments = getAssessments();

  const getRiskInsights = (risk: number) => {
    if (risk < 10) {
      return {
        message: "🎉 Amazing! Your heart is throwing a healthy party!",
        recommendations: [
          "Keep rocking those healthy lifestyle habits! 🌟",
          "Your heart loves your exercise routine! Keep it up! 💪",
          "Continue monitoring - your heart is in the party mood! 🎊",
        ],
      };
    }
    if (risk < 20) {
      return {
        message: "💛 Your heart's doing okay, but let's turn up the health party!",
        recommendations: [
          "Let's get 150 minutes of heart-pumping fun per week! 🏃‍♀️",
          "Show your heart some love with fruits and veggies! 🥗",
          "Keep an eye on blood pressure - your heart will thank you! 💝",
        ],
      };
    }
    if (risk < 30) {
      return {
        message: "🧡 Time to give your heart some extra love and attention!",
        recommendations: [
          "Chat with your doctor about a heart-healthy action plan 👨‍⚕️",
          "Consider medication if your healthcare provider recommends it 💊",
          "Transform your lifestyle: diet, exercise, and chill vibes! 🧘‍♀️",
        ],
      };
    }
    return {
      message: "❤️ Your heart needs immediate care and attention!",
      recommendations: [
        "Schedule a doctor visit ASAP - your heart is calling! 📞",
        "Discuss medication and lifestyle changes with your provider 💬",
        "Consider a cardiac evaluation for your heart's health 🏥",
      ],
    };
  };

  if (!latestAssessment) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="w-24 h-24 bg-gradient-to-br from-pink-400 via-red-400 to-rose-400 rounded-full flex items-center justify-center mb-6 shadow-2xl"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="w-14 h-14 text-white" fill="white" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 via-red-600 to-rose-600 bg-clip-text text-transparent">
          Welcome to Artery Party! 🎉
        </h2>
        <p className="text-gray-700 text-center max-w-md mb-8">
          Let's get this party started! Take your first health assessment and discover how your heart is doing. 
          We'll give you personalized insights to keep your heart happy and healthy! ❤️
        </p>
        <Button 
          onClick={() => navigate("/assessment")} 
          size="lg"
          className="bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 hover:from-pink-600 hover:via-red-600 hover:to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Heart className="w-5 h-5 mr-2" fill="white" />
          Start Heart Check
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Chat Feature Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 max-w-md"
        >
          <Card className="p-6 border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  💬 Chat with Your Heart Helper!
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Click the floating heart button in the bottom-right corner to talk with our AI assistant! 
                  Ask questions about heart health, get tips, and more - all with voice or text! 🎤
                </p>
                <div className="flex items-center gap-2 text-xs text-pink-600 font-medium">
                  <Heart className="w-3 h-3" fill="currentColor" />
                  Speech-to-speech enabled!
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  const insights = getRiskInsights(latestAssessment.riskPercentage);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-rose-600 bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-pink-500" fill="currentColor" />
            Heart Dashboard
          </h1>
          <p className="text-gray-700 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-500" />
            Last check: {new Date(latestAssessment.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button 
          onClick={() => navigate("/assessment")}
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold shadow-lg"
        >
          <Heart className="w-4 h-4 mr-2" fill="white" />
          New Check
        </Button>
      </motion.div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 flex items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-rose-50 border-2 border-pink-200 shadow-xl">
            <RiskGauge percentage={latestAssessment.riskPercentage} size={240} />
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-2 border-pink-200 shadow-xl bg-white">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
                  Heart Status
                </h3>
                <p className="text-gray-700 text-lg">{insights.message}</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">💝 Recommendations</h4>
              <ul className="space-y-3">
                {insights.recommendations.map((rec, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start gap-3 text-gray-700 p-3 rounded-lg bg-pink-50 border border-pink-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Heart className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" fill="currentColor" />
                    <span>{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-pink-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Blood Pressure</h3>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {latestAssessment.healthData.SYSBP}/{latestAssessment.healthData.DIABP}
            </p>
            <p className="text-sm text-gray-600 mt-1 font-medium">mmHg</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-red-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Heart Rate</h3>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              {latestAssessment.healthData.HEARTRTE}
            </p>
            <p className="text-sm text-gray-600 mt-1 font-medium">bpm</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-green-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Cholesterol</h3>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {latestAssessment.healthData.TOTCHOL}
            </p>
            <p className="text-sm text-gray-600 mt-1 font-medium">mg/dL</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-purple-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Total Checks</h3>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{assessments.length}</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">completed</p>
          </Card>
        </motion.div>
      </div>

      {/* Trends */}
      {assessments.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-pink-500" />
            Heart Health Trends
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MetricsChart
              assessments={assessments}
              metric="SYSBP"
              title="Systolic Blood Pressure"
              unit="mmHg"
              color="#e91e63"
            />
            <MetricsChart
              assessments={assessments}
              metric="HEARTRTE"
              title="Heart Rate"
              unit="bpm"
              color="#ef4444"
            />
            <MetricsChart
              assessments={assessments}
              metric="TOTCHOL"
              title="Total Cholesterol"
              unit="mg/dL"
              color="#ec407a"
            />
            <MetricsChart
              assessments={assessments}
              metric="BMI"
              title="Body Mass Index"
              unit="kg/m²"
              color="#f06292"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}