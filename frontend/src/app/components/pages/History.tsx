import { useState } from "react";
import {
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Sparkles,
  History as HistoryIcon,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { getAssessments, clearAssessments } from "../utils/storage";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function History() {
  const [assessments, setAssessments] = useState(getAssessments());

  const handleClearHistory = () => {
    clearAssessments();
    setAssessments([]);
    toast.success("🎉 History cleared successfully!");
  };

  const getRiskColor = (risk: number) => {
    if (risk < 10) return "text-green-600 bg-green-100 border-green-300";
    if (risk < 20) return "text-yellow-600 bg-yellow-100 border-yellow-300";
    if (risk < 30) return "text-orange-600 bg-orange-100 border-orange-300";
    return "text-red-600 bg-red-100 border-red-300";
  };

  const getTrendIcon = (currentRisk: number, previousRisk: number) => {
    if (currentRisk < previousRisk)
      return <TrendingDown className="w-5 h-5 text-green-600" />;
    if (currentRisk > previousRisk)
      return <TrendingUp className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  if (assessments.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-pink-200 to-red-200 rounded-full flex items-center justify-center mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <HistoryIcon className="w-12 h-12 text-pink-600" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
          No History Yet! 📋
        </h2>
        <p className="text-gray-700 text-center max-w-md">
          Complete your first heart check to start tracking your cardiovascular
          health over time. Your heart's journey begins here! ❤️
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-rose-600 bg-clip-text text-transparent flex items-center gap-3">
            <HistoryIcon className="w-9 h-9 text-pink-500" />
            Heart History
          </h1>
          <p className="text-gray-700 mt-2 font-medium">
            Track your heart health journey over time 📊
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              className="bg-pink-500 text-white border border-pink-500 hover:bg-pink-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="border-2 border-pink-200 bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-pink-700">
                <Heart className="w-5 h-5" fill="currentColor" />
                Clear all history?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All your past heart checks will be
                permanently deleted from your history! 🗑️
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex justify-end gap-2">
              <AlertDialogCancel className="bg-gray-200 text-gray-800 border rounded px-4 py-2 hover:bg-gray-300">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearHistory}
                className="bg-pink-500 text-white rounded px-4 py-2 hover:bg-pink-600"
              >
                Clear History
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Heart Checks",
            icon: <Sparkles className="w-5 h-5 text-pink-500" fill="currentColor" />,
            value: assessments.length,
            bg: "bg-gradient-to-br from-white to-pink-50",
            textColor: "text-pink-600",
          },
          {
            label: "Latest Risk",
            icon: <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />,
            value: assessments[0].riskPercentage + "%",
            bg: "bg-gradient-to-br from-white to-red-50",
            textColor: getRiskColor(assessments[0].riskPercentage).split(" ")[0],
          },
          {
            label: "Risk Trend",
            icon: <TrendingUp className="w-5 h-5 text-pink-500" />,
            value: null,
            bg: "bg-gradient-to-br from-white to-purple-50",
            textColor: "",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.1 }}
          >
            <Card className={`p-6 border-2 border-pink-200 shadow-lg ${stat.bg}`}>
              <div className="flex items-center gap-2 mb-2">{stat.icon}
                <h3 className="text-sm font-bold text-gray-700">{stat.label}</h3>
              </div>
              {stat.label === "Risk Trend" ? (
                <div className="flex items-center gap-2">
                  {assessments.length > 1 ? (
                    <>
                      {getTrendIcon(
                        assessments[0].riskPercentage,
                        assessments[1].riskPercentage
                      )}
                      <p className="text-4xl font-bold text-gray-900">
                        {Math.abs(
                          assessments[0].riskPercentage - assessments[1].riskPercentage
                        ).toFixed(1)}
                        %
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 font-medium">Not enough data yet 📈</p>
                  )}
                </div>
              ) : (
                <p className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Assessment Timeline */}
      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="p-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
                    <h3 className="font-bold text-gray-900 text-lg">
                      {new Date(assessment.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getRiskColor(
                        assessment.riskPercentage
                      )}`}
                    >
                      {assessment.riskLevel} Risk
                    </span>
                    {index > 0 && (
                      <div className="flex items-center gap-1 p-2 bg-gray-50 rounded-lg">
                        {getTrendIcon(
                          assessment.riskPercentage,
                          assessments[index - 1].riskPercentage
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                      <span className="text-gray-600 font-medium">CVD Risk</span>
                      <p className="font-bold text-pink-600 text-xl">{assessment.riskPercentage}%</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="text-gray-600 font-medium">Age</span>
                      <p className="font-bold text-blue-600 text-xl">{assessment.healthData.AGE}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <span className="text-gray-600 font-medium">BP</span>
                      <p className="font-bold text-purple-600 text-xl">
                        {assessment.healthData.SYSBP}/{assessment.healthData.DIABP}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <span className="text-gray-600 font-medium">Heart Rate</span>
                      <p className="font-bold text-red-600 text-xl">{assessment.healthData.HEARTRTE}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <span className="text-gray-600 font-medium">Cholesterol</span>
                      <p className="font-bold text-green-600 text-xl">{assessment.healthData.TOTCHOL}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <span className="text-gray-600 font-medium">BMI</span>
                      <p className="font-bold text-orange-600 text-xl">{assessment.healthData.BMI}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}