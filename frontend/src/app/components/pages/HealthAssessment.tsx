import { useState } from "react";
import { useNavigate } from "react-router";
import { Loader2, Save, Sparkles, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import XMLUploader from "../XMLUploader";
import HealthDataForm from "../HealthDataForm";
import RiskGauge from "../RiskGauge";
import { HealthData, AssessmentResult } from "../types/health";
import { DEFAULT_HEALTH_DATA } from "../utils/constants";
import { predictCVDRisk } from "../utils/api";
import { saveAssessment } from "../utils/storage";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function HealthAssessment() {
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState<HealthData>(DEFAULT_HEALTH_DATA);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleXMLDataParsed = (parsedData: Partial<HealthData>) => {
    setHealthData((prev) => ({ ...prev, ...parsedData }));
  };

  const handleCalculateRisk = async () => {
    setIsCalculating(true);
    try {
      const riskPercentage = await predictCVDRisk(healthData);
      
      let riskLevel: "Low" | "Moderate" | "High" | "Very High" = "Low";
      if (riskPercentage >= 30) riskLevel = "Very High";
      else if (riskPercentage >= 20) riskLevel = "High";
      else if (riskPercentage >= 10) riskLevel = "Moderate";

      const assessment: AssessmentResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        healthData: { ...healthData },
        riskPercentage,
        riskLevel,
      };

      saveAssessment(assessment);
      setResult(assessment);
      toast.success("🎉 Assessment completed successfully!");
    } catch (error) {
      toast.error("Failed to calculate risk. Please try again.");
      console.error("Risk calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleStartNew = () => {
    setResult(null);
    setHealthData(DEFAULT_HEALTH_DATA);
  };

  if (result) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 border-2 border-pink-200 shadow-2xl bg-white">
            <div className="text-center mb-8">
              <motion.div 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-100 to-red-100 text-pink-700 rounded-full mb-4 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Sparkles className="w-5 h-5" fill="currentColor" />
                <span className="font-bold">Assessment Complete! 🎊</span>
              </motion.div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-rose-600 bg-clip-text text-transparent">
                Your Heart Report Card
              </h2>
              <p className="text-gray-700 mt-2 font-medium">
                Based on the Framingham Heart Study predictive model
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <RiskGauge percentage={result.riskPercentage} size={280} />
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-6 mb-8 border-2 border-pink-200">
              <h3 className="font-bold text-gray-900 mb-3 text-xl flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
                What does this mean?
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your 10-year risk of developing cardiovascular disease is{" "}
                <span className="font-bold text-pink-600 text-xl">{result.riskPercentage}%</span>. This means that
                if 100 people with similar health profiles were studied over 10 years,
                approximately {result.riskPercentage} would experience a cardiovascular event.
              </p>
              <div className="bg-white/70 rounded-lg p-4 border border-pink-200">
                <p className="text-sm text-gray-700">
                  <strong className="text-pink-600">💝 Important:</strong> This is a statistical estimate based on population
                  data and should not replace professional medical advice. Please consult with your
                  healthcare provider for personalized guidance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleStartNew} 
                variant="outline" 
                className="flex-1 border-2 border-pink-300 hover:bg-pink-50 font-bold"
              >
                <Heart className="w-4 h-4 mr-2" />
                Start New Check
              </Button>
              <Button 
                onClick={() => navigate("/")} 
                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-rose-600 bg-clip-text text-transparent flex items-center gap-3">
          <Heart className="w-10 h-10 text-pink-500" fill="currentColor" />
          Heart Health Check
        </h1>
        <p className="text-gray-700 mt-2 text-lg">
          Complete your health profile to calculate your cardiovascular disease risk 💖
        </p>
      </div>

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-pink-100 border-2 border-pink-200">
          <TabsTrigger 
            value="manual"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold"
          >
            Manual Entry
          </TabsTrigger>
          <TabsTrigger 
            value="import"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold"
          >
            Import Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          <Card className="p-6 border-2 border-pink-200 shadow-lg bg-white">
            <XMLUploader onDataParsed={handleXMLDataParsed} />
            {Object.keys(healthData).some(
              (key) => healthData[key as keyof HealthData] !== DEFAULT_HEALTH_DATA[key as keyof HealthData]
            ) && (
              <motion.div 
                className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4" fill="currentColor" />
                  ✓ Data imported successfully! Switch to Manual Entry tab to review and complete
                  your health profile.
                </p>
              </motion.div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card className="p-6 border-2 border-pink-200 shadow-lg bg-white">
            <HealthDataForm data={healthData} onChange={setHealthData} />
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button 
          onClick={handleCalculateRisk} 
          disabled={isCalculating} 
          size="lg"
          className="bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 hover:from-pink-600 hover:via-red-600 hover:to-rose-600 text-white font-bold shadow-xl text-lg px-8"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 mr-2" fill="white" />
              Calculate Heart Risk
              <Sparkles className="w-5 h-5 ml-2" fill="white" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}