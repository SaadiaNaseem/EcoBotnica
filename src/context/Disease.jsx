// context/disease.jsx
import React, { createContext, useState } from "react";
import axios from "axios";

export const Disease = createContext();

export const DiseaseProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const diagnoseDisease = async (imageFile) => {
    setLoading(true);
    setError("");
    setResponse(""); // Clear previous response

    try {
      // Send image to your FastAPI backend
      const formData = new FormData();
      formData.append("file", imageFile); // Changed from "image" to "file"

      const diagnosisRes = await fetch("https://saira34-disease-model.hf.space/diagnose-disease", { 
        method: "POST", 
        body: formData 
      });

      if (!diagnosisRes.ok) {
        throw new Error("Failed to diagnose image");
      }

      const diagnosisData = await diagnosisRes.json();
      console.log("Diagnosis API Response:", diagnosisData);

      // Check if diagnosis was successful
      if (!diagnosisData.success) {
        throw new Error(diagnosisData.error || "Diagnosis failed");
      }

      const diseaseName = diagnosisData.diagnosis;
      const confidence = diagnosisData.confidence;

      console.log(`Detected: ${diseaseName} with ${confidence}% confidence`);

      // If it's a healthy plant, return early
      if (diagnosisData.is_healthy) {
        const healthyMessage = `🌱 Healthy Plant Detected! \n\nYour plant appears to be healthy with ${confidence}% confidence. Continue with your current care routine!`;
        setResponse(healthyMessage);
        return healthyMessage;
      }

      // Get detailed disease info from AI
      const fullPrompt = `You are a plant care assistant. Provide detailed information about this plant disease in simple terms:

Identified Disease: ${diseaseName}

Please provide information in this format:

**Identified Disease:**
- [Disease name and brief description]

**Severity:**
- [Mild/Moderate/Severe]

**Cause:**
- [Main causes of this disease]

**Symptoms:**
- [Common symptoms to look for]

**Treatment:**
- **Watering:** [Watering recommendations]
- **Fertilization:** [Fertilizer suggestions]  
- **Pruning:** [Pruning instructions]
- **Light:** [Light requirements]
- **Pest Control:** [Pest management if needed]

**Urgency:**
- [Low/Moderate/High urgency for treatment]

Keep it practical and easy to understand for home gardeners.`;

      const aiRes = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: fullPrompt }],
        },
        {
          headers: {
            Authorization: "Bearer API KEY", // Add your key
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = aiRes.data.choices[0].message.content;
      setResponse(aiResponse);
      console.log("AI Response:", aiResponse);

      return aiResponse;

    } catch (err) {
      console.error("Error in diagnoseDisease:", err);
      const errorMsg = err.message || "❌ Error fetching data. Please try again.";
      setError(errorMsg);
      setResponse(errorMsg);
      return errorMsg;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Disease.Provider value={{ diagnoseDisease, response, loading, error, setResponse }}>
      {children}
    </Disease.Provider>
  );
};