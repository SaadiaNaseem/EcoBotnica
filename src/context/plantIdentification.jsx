import React, { createContext, useState, useContext } from "react";
import axios from "axios";

export const PlantIdentification = createContext();

export const PlantIdentificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [error, setError] = useState("");

  const classifyImage = async (imageFile) => {
    setLoading(true);
    setError("");
    setClassificationResult(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      console.log("🔍 Starting smart classification...");

      let plantData = null;
      let flowerData = null;
      let plantError = null;
      let flowerError = null;

      try {
        const [plantResponse, flowerResponse] = await Promise.allSettled([
          fetch("https://saira34-plant-model.hf.space/identify-plant", {
            method: "POST",
            body: formData,
          }),
          fetch("https://saira34-flower-model.hf.space/identify-flower", {
            method: "POST",
            body: formData,
          })
        ]);

        if (plantResponse.status === 'fulfilled' && plantResponse.value.ok) {
          plantData = await plantResponse.value.json();
          console.log("🌿 Plant Model:", plantData);
        } else {
          plantError = plantResponse.status === 'rejected' ? plantResponse.reason.message : 'Plant model failed';
        }

        if (flowerResponse.status === 'fulfilled' && flowerResponse.value.ok) {
          flowerData = await flowerResponse.value.json();
          console.log("🌸 Flower Model:", flowerData);
        } else {
          flowerError = flowerResponse.status === 'rejected' ? flowerResponse.reason.message : 'Flower model failed';
        }

      } catch (fetchError) {
        console.error("❌ Fetch Error:", fetchError);
      }

      let finalResult = null;
      let selectedModel = null;

      const plantSuccess = plantData?.success && plantData.confidence > 30;
      const flowerSuccess = flowerData?.success && flowerData.confidence > 30;

      if (plantSuccess && flowerSuccess) {
        if (flowerData.confidence > plantData.confidence) {
          console.log("✅ Choosing Flower Model (higher confidence)", flowerData.confidence, "vs", plantData.confidence);
          selectedModel = { type: "flower", data: flowerData, confidence: flowerData.confidence };
        } else {
          console.log("✅ Choosing Plant Model (higher confidence)", plantData.confidence, "vs", flowerData.confidence);
          selectedModel = { type: "plant", data: plantData, confidence: plantData.confidence };
        }
      } else if (flowerSuccess) {
        console.log("✅ Using Flower Model (plant failed)");
        selectedModel = { type: "flower", data: flowerData, confidence: flowerData.confidence };
      } else if (plantSuccess) {
        console.log("✅ Using Plant Model (flower failed)");
        selectedModel = { type: "plant", data: plantData, confidence: plantData.confidence };
      }

      if (selectedModel) {
        console.log("🎯 Selected Model:", selectedModel.type, "with confidence:", selectedModel.confidence);
        
        const detailedAnalysis = await getDetailedAnalysis(selectedModel);

        finalResult = {
          success: true,
          message: detailedAnalysis,
          rawData: selectedModel.data,
          modelUsed: selectedModel.type,
          confidence: selectedModel.confidence,
          detailedReport: detailedAnalysis,
          plantType: selectedModel.type === 'plant' ? selectedModel.data.plant_type : null,
          flowerType: selectedModel.type === 'flower' ? selectedModel.data.prediction : null,
          debug: { 
            plantModel: plantData, 
            flowerModel: flowerData,
            selectionReason: `Chosen ${selectedModel.type} model with ${selectedModel.confidence}% confidence`
          }
        };
      }

      if (finalResult) {
        setClassificationResult(finalResult);
        return finalResult;
      }

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

  // UPDATED PROMPT FOR STRUCTURED DATA
  const getDetailedAnalysis = async (bestResult) => {
    try {
      const { type, data, confidence } = bestResult;
      
      let identification = "";
      let plantName = "";

      if (type === "plant") {
        plantName = data.plant_type ? data.plant_type.replace(/_/g, ' ').toUpperCase() : "Unknown Plant";
        identification = `Plant: ${plantName}`;
      } else if (type === "flower") {
        plantName = data.prediction ? data.prediction.replace(/_/g, ' ').toUpperCase() : "Unknown Flower";
        identification = `Flower: ${plantName}`;
      }

      console.log("🌿 Getting AI analysis for:", identification);

      const fullPrompt = `You are a professional botanist. Analyze this ${type} and provide structured information:

**PLANT IDENTIFICATION:**
${identification}
**Confidence Level:** ${confidence}%

Please provide information in this EXACT JSON format:
{
  "identification": {
    "commonName": "Common name",
    "scientificName": "Scientific name",
    "family": "Plant family"
  },
  "characteristics": {
    "description": "Physical description",
    "height": "Typical height range",
    "bloomingSeason": "When it blooms",
    "lifespan": "Plant lifespan"
  },
  "growingConditions": {
    "sunlight": "Sunlight requirements",
    "water": "Watering needs",
    "soil": "Soil type preferences",
    "temperature": "Temperature range",
    "humidity": "Humidity preferences"
  },
  "careInstructions": {
    "watering": "Detailed watering instructions",
    "fertilizing": "Fertilization schedule",
    "pruning": "Pruning requirements",
    "maintenance": "General maintenance tips"
  },
  "propagation": "Propagation methods",
  "commonUses": ["Use 1", "Use 2", "Use 3"],
  "toxicity": "Toxicity information for pets/humans",
  "commonProblems": [
    {
      "problem": "Problem name",
      "symptoms": "Symptoms description",
      "solution": "Solution steps"
    }
  ],
  "funFact": "An interesting fact about this plant"
}

Make sure the response is valid JSON only, no additional text.`;

      const aiRes = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: fullPrompt }],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            Authorization: "Bearer", // Add your key
            "Content-Type": "application/json",
          },
        }
      );

      // Parse the JSON response
      const parsedData = JSON.parse(aiRes.data.choices[0].message.content);
      return parsedData;

    } catch (error) {
      console.error("❌ OpenRouter Error:", error);
      
      // Fallback structured data
      const { type, data, confidence } = bestResult;
      const plantName = type === "plant" 
        ? data.plant_type ? data.plant_type.replace(/_/g, ' ').toUpperCase() : "Unknown Plant"
        : data.prediction ? data.prediction.replace(/_/g, ' ').toUpperCase() : "Unknown Flower";

      return {
        identification: {
          commonName: plantName,
          scientificName: "Scientific name not available",
          family: `${type.charAt(0).toUpperCase() + type.slice(1)} Family`
        },
        characteristics: {
          description: `This appears to be a ${plantName}. Based on visual analysis, this ${type} shows typical characteristics.`,
          height: "Varies by species",
          bloomingSeason: "Seasonal",
          lifespan: "Perennial"
        },
        growingConditions: {
          sunlight: "Requires adequate sunlight",
          water: "Moderate watering needed",
          soil: "Well-draining soil recommended",
          temperature: "Adaptable to various temperatures",
          humidity: "Moderate humidity preferred"
        },
        careInstructions: {
          watering: "Water when top soil feels dry",
          fertilizing: "Fertilize during growing season",
          pruning: "Prune as needed for shape and health",
          maintenance: "Monitor for common plant diseases"
        },
        propagation: "Seeds, cuttings, or division",
        commonUses: ["Ornamental gardening", "Landscaping"],
        toxicity: "Generally non-toxic (verify with local experts)",
        commonProblems: [
          {
            problem: "General Care",
            symptoms: "Monitor plant health regularly",
            solution: "Follow basic care instructions above"
          }
        ],
        funFact: `Identified with ${confidence}% confidence using AI technology!`
      };
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
        clearResults
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