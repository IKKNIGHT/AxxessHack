import { HealthData } from "../types/health";

// Service endpoints
const LLM_SERVICE = "http://localhost:5000"; // LLM feedback service
const CVD_API_SERVICE = "http://localhost:5001"; // CVD prediction service

/**
 * Generate personalized feedback from LLM based on health metrics
 */
export async function generateLLMFeedback(bio: string): Promise<string> {
  try {
    console.log("🔵 Sending LLM feedback request");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error("⏱️ LLM service timeout");
      controller.abort();
    }, 40000); // 40 second timeout (35s on backend + buffer)
    
    const response = await fetch(`${LLM_SERVICE}/api/generate-feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bio }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("🟢 LLM service response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("🔴 LLM service error response:", errorData);
      throw new Error(`LLM service error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🟢 LLM service response data source:", data.source);
    console.log("🟢 LLM feedback length:", data.feedback?.length);
    
    return data.feedback || "No recommendations available";
  } catch (error) {
    console.error("🔴 LLM feedback error:", error);
    // Return fallback recommendations instead of throwing
    const fallback = `• Schedule a check-up with your doctor\n• Aim for 150 minutes of moderate exercise weekly\n• Reduce salt and processed foods\n• Manage stress through relaxation techniques`;
    console.warn("⚠️ Returning fallback recommendations");
    return fallback;
  }
}

/**
 * Predict CVD risk using the ML model
 */
export async function predictCVDRisk(healthData: HealthData): Promise<number> {
  try {
    console.log("🔵 Sending CVD prediction request");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error("⏱️ CVD API timeout");
      controller.abort();
    }, 15000); // 15 second timeout
    
    const response = await fetch(`${CVD_API_SERVICE}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(healthData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("🟢 CVD API response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("🔴 CVD API error response:", errorData);
      throw new Error(`CVD API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🟢 CVD API response data:", data);
    
    if (!data.cvd_probability_percent && data.cvd_probability_percent !== 0) {
      console.warn("⚠️ No cvd_probability_percent in response, returning 15");
      return 15;
    }
    
    return data.cvd_probability_percent;
  } catch (error) {
    console.error("🔴 CVD prediction error:", error);
    console.warn("⚠️ Returning default CVD risk of 15% due to error");
    return 15; // Return default instead of throwing
  }
}
