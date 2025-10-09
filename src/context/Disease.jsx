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
      // First, send image to your Flask API for disease identification
      const formData = new FormData();
      formData.append("image", imageFile);

      const diagnosisRes = await fetch("http://127.0.0.1:5000/diagnose", {
        method: "POST",
        body: formData,
      });

      if (!diagnosisRes.ok) {
        throw new Error("Failed to diagnose image");
      }

      const diagnosisData = await diagnosisRes.json();
      console.log("Diagnosis API Response:", diagnosisData);

      const diseaseName = diagnosisData.diagnosis;

      // Then, get detailed disease info from AI
      const fullPrompt = `You are a plant care assistant. The user will provide a plant name and the system will identify the disease and provide detailed information related to it.

If the input is a valid plant disease name, generate detailed disease information using the format below:

Identified Disease:
  - Mention the detected disease for the plant (e.g., Leaf Yellowing, Root Rot, etc.).

Severity:
  - State the severity of the disease (e.g., Mild, Moderate, Severe).

Cause:
  - Explain the potential causes of the disease (e.g., nutrient deficiencies, overwatering, pests, etc.).

Symptoms:
  - List common symptoms (e.g., yellowing leaves, weak growth, wilting).

Treatments:
  - Provide specific steps for treatment:
    - Watering: Recommended watering practices (e.g., allow soil to dry, avoid overwatering).
    - Fertilization: Suggestions on fertilizers or nutrients to apply (e.g., balanced fertilizer, iron supplements).
    - Pruning: How to prune affected parts of the plant (e.g., remove yellow leaves).
    - Light: Ideal lighting conditions (e.g., bright, indirect sunlight).
    - Pest Control: If applicable, suggest treatments for pests (e.g., neem oil for spider mites).

Urgency:
  - Specify the urgency of treatment (e.g., Low, Moderate, High).

BUT — if the input is not a valid plant disease name or if it seems like a general question or sentence, reply with:
no details found related to this disease.

Here is the user input: "${diseaseName}"`;

      const aiRes = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: fullPrompt }],
        },
        {
          headers: {
            Authorization: "Bearer API_KEY", // You need to add your actual API key
            "Content-Type": "application/json",
          },
        }
      );
      
      const aiResponse = aiRes.data.choices[0].message.content;
      setResponse(aiResponse); // Set state with the response
      console.log("AI Response:", aiResponse);
      
      return aiResponse;

    } catch (err) {
      console.error("Error in diagnoseDisease:", err);
      const errorMsg = "❌ Error fetching data. Please try again.";
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