// context/plantIdentification.jsx - FIXED URL VERSION
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

export const PlantIdentification = createContext();

export const PlantIdentificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [error, setError] = useState("");

  // OPTIMIZED CLASSIFICATION FUNCTION
  const classifyImage = async (imageFile) => {
    setLoading(true);
    setError("");
    setClassificationResult(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      console.log("🔍 Starting smart classification...");

      // TEST BOTH MODELS IN PARALLEL
      let plantData = null;
      let flowerData = null;
      let plantError = null;
      let flowerError = null;

      try {
        // Run both models in parallel for better performance
        const [plantResponse, flowerResponse] = await Promise.all([
          // FIXED: Use correct plant model URL
          fetch("https://saira34-plant-model.hf.space/identify-plant", {
            method: "POST",
            body: formData,
          }).catch(err => { throw new Error(`Plant model: ${err.message}`) }),
          
          // FIXED: Use correct flower model URL
          fetch("https://saira34-flower-model.hf.space/identify-flower", {
            method: "POST",
            body: formData,
          }).catch(err => { throw new Error(`Flower model: ${err.message}`) })
        ]);

        // Parse responses
        plantData = await plantResponse.json();
        flowerData = await flowerResponse.json();

        console.log("🌿 Plant Model:", plantData);
        console.log("🌸 Flower Model:", flowerData);

      } catch (fetchError) {
        console.error("❌ Fetch Error:", fetchError);
        // If parallel fails, try sequentially
        try {
          const plantResponse = await fetch("https://saira34-plant-model.hf.space/identify-plant", {
            method: "POST",
            body: formData,
          });
          plantData = await plantResponse.json();
        } catch (err) {
          plantError = err.message;
        }

        try {
          // FIXED: Use correct flower model URL
          const flowerResponse = await fetch("https://saira34-flower-model.hf.space/identify-flower", {
            method: "POST",
            body: formData,
          });
          flowerData = await flowerResponse.json();
        } catch (err) {
          flowerError = err.message;
        }
      }

      // 🎯 IMPROVED RESULT SELECTION LOGIC
      let finalResult = null;

      // Priority 1: Plant model with good confidence
      if (plantData?.success && plantData.confidence > 40) {
        console.log("✅ Using Plant Model (high confidence)");
        const detailedAnalysis = await getDetailedAnalysis({
          type: "plant",
          data: plantData,
          confidence: plantData.confidence
        });

        finalResult = {
          success: true,
          message: detailedAnalysis,
          rawData: plantData,
          modelUsed: "plant",
          confidence: plantData.confidence,
          detailedReport: detailedAnalysis,
          plantType: plantData.plant_type,
          debug: { plantModel: plantData, flowerModel: flowerData }
        };
      }
      // Priority 2: Flower model with good confidence (if plant failed)
      else if (flowerData?.success && flowerData.confidence > 60) {
        console.log("✅ Using Flower Model (plant failed)");
        const detailedAnalysis = await getDetailedAnalysis({
          type: "flower",
          data: flowerData,
          confidence: flowerData.confidence
        });

        finalResult = {
          success: true,
          message: detailedAnalysis,
          rawData: flowerData,
          modelUsed: "flower",
          confidence: flowerData.confidence,
          detailedReport: detailedAnalysis,
          flowerType: flowerData.prediction,
          debug: { plantModel: plantData, flowerModel: flowerData }
        };
      }
      // Priority 3: Plant model with low confidence but better than flower
      else if (plantData?.success && (!flowerData?.success || plantData.confidence > flowerData.confidence)) {
        console.log("⚠️ Using Plant Model (low confidence)");
        const detailedAnalysis = await getDetailedAnalysis({
          type: "plant",
          data: plantData,
          confidence: plantData.confidence
        });

        finalResult = {
          success: true,
          message: detailedAnalysis,
          rawData: plantData,
          modelUsed: "plant",
          confidence: plantData.confidence,
          detailedReport: detailedAnalysis,
          plantType: plantData.plant_type,
          debug: { plantModel: plantData, flowerModel: flowerData }
        };
      }
      // Priority 4: Flower model as last resort
      else if (flowerData?.success) {
        console.log("⚠️ Using Flower Model (last resort)");
        const detailedAnalysis = await getDetailedAnalysis({
          type: "flower",
          data: flowerData,
          confidence: flowerData.confidence
        });

        finalResult = {
          success: true,
          message: detailedAnalysis,
          rawData: flowerData,
          modelUsed: "flower",
          confidence: flowerData.confidence,
          detailedReport: detailedAnalysis,
          flowerType: flowerData.prediction,
          debug: { plantModel: plantData, flowerModel: flowerData }
        };
      }

      // If we found a result
      if (finalResult) {
        setClassificationResult(finalResult);
        return finalResult;
      }

      // 🚨 NO SUITABLE RESULTS FOUND
      let errorMessage = "🔍 Unable to identify the plant or flower.\n\n";

      if (plantData && !plantData.success) {
        errorMessage += `🌿 Plant Model: ${plantData.error || 'Unknown error'}\n`;
      }
      if (flowerData && !flowerData.success) {
        errorMessage += `🌸 Flower Model: ${flowerData.error || 'Unknown error'}\n`;
      }
      if (plantError) errorMessage += `🌿 Plant Error: ${plantError}\n`;
      if (flowerError) errorMessage += `🌸 Flower Error: ${flowerError}\n`;

      errorMessage += "\n💡 Try uploading a clearer image of a single plant or flower!";

      const errorResult = {
        success: false,
        message: errorMessage,
        modelUsed: "none",
        debug: {
          plantModel: plantData,
          flowerModel: flowerData,
          plantError,
          flowerError
        }
      };

      setClassificationResult(errorResult);
      return errorResult;

    } catch (err) {
      console.error("❌ Classification Error:", err);
      
      const errorMsg = "🌿 Connection error. Please check your internet and try again.";
      setError(errorMsg);

      return { 
        success: false, 
        message: errorMsg,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  // IMPROVED getDetailedAnalysis with better error handling
  const getDetailedAnalysis = async (bestResult) => {
    try {
      const { type, data } = bestResult;
      
      let identification = "";
      let additionalInfo = "";

      if (type === "plant") {
        identification = `Plant: ${data.plant_type || "Unknown Plant"}`;
        additionalInfo = `Confidence: ${data.confidence}%`;
      } else if (type === "flower") {
        const flowerName = data.prediction ? data.prediction.replace(/_/g, ' ').toUpperCase() : "Unknown Flower";
        identification = `Flower: ${flowerName}`;
        additionalInfo = `Confidence: ${data.confidence}%`;
      }

      console.log("🌿 Getting AI analysis for:", identification);

      const fullPrompt = `You are a professional botanist and plant care expert. Provide a COMPREHENSIVE analysis of:

**IDENTIFIED PLANT/FLOWER:**
${identification}
${additionalInfo}

Please provide detailed information including:
- Common and scientific names
- Plant characteristics and appearance  
- Optimal growing conditions
- Care instructions (watering, sunlight, soil)
- Propagation methods
- Common uses and benefits
- Toxicity information (if any)
- Common problems and solutions

Format the response in clear sections with emojis for better readability.`;

      const aiRes = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: fullPrompt }],
          max_tokens: 2000,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: "Bearer YOUR_API_KEY", // REPLACE WITH YOUR KEY
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      return aiRes.data.choices[0].message.content;

    } catch (error) {
      console.error("❌ OpenRouter Error:", error);
      
      // Better fallback messages
      if (bestResult.type === "plant") {
        return `🌿 **PLANT IDENTIFIED!**\n\n**Plant:** ${bestResult.data.plant_type || "Unknown"}\n**Confidence:** ${bestResult.data.confidence}%\n\n*Plant identification successful! For detailed care instructions, try uploading a clearer image or consult a gardening expert.*`;
      } else {
        const flowerName = bestResult.data.prediction ? bestResult.data.prediction.replace(/_/g, ' ').toUpperCase() : "Unknown";
        return `🌸 **FLOWER IDENTIFIED!**\n\n**Flower:** ${flowerName}\n**Confidence:** ${bestResult.data.confidence}%\n\n*Flower identification successful! For detailed care instructions, try uploading a clearer image or consult a gardening expert.*`;
      }
    }
  };

  // Test individual models
  const testPlantModelOnly = async (imageFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      console.log("🧪 Testing Plant Model Only");
      
      const response = await fetch("https://saira34-plant-model.hf.space/identify-plant", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("🧪 Plant Model Result:", data);
      
      return {
        success: data.success,
        plantData: data,
        rawResponse: data
      };
    } catch (error) {
      console.error("🧪 Plant Model Test Error:", error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const testFlowerModelOnly = async (imageFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      console.log("🧪 Testing Flower Model Only");
      
      // FIXED: Use correct flower model URL
      const response = await fetch("https://saira34-flower-model.hf.space/identify-flower", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("🧪 Flower Model Result:", data);
      
      return {
        success: data.success,
        flowerData: data,
        rawResponse: data
      };
    } catch (error) {
      console.error("🧪 Flower Model Test Error:", error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setClassificationResult(null);
    setError("");
  };

  return (
    <PlantIdentification.Provider
      value={{
        classifyImage,
        classificationResult,
        loading,
        error,
        clearResults,
        testPlantModelOnly,
        testFlowerModelOnly
      }}
    >
      {children}
    </PlantIdentification.Provider>
  );
};

export const usePlantIdentification = () => {
  const context = useContext(PlantIdentification);
  if (!context) {
    throw new Error("usePlantIdentification must be used inside PlantIdentificationProvider");
  }
  return context;
};