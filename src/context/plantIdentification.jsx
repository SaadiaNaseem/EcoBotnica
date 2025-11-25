// context/plantIdentification.jsx
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

export const PlantIdentification = createContext();

export const PlantIdentificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [error, setError] = useState("");

  // MAIN SMART CLASSIFICATION FUNCTION
  const classifyImage = async (imageFile) => {
    setLoading(true);
    setError("");
    setClassificationResult(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      console.log("🌿 Starting smart classification...");

      // Run BOTH models simultaneously
      const [plantResult, flowerResult] = await Promise.allSettled([
        // Try Plant Identification
        fetch("https://saira34-ecobotanica-api.hf.space/identify-plant", {
          method: "POST",
          body: formData,
        }).then(res => res.json()),
        
        // Try Flower Classification  
        fetch("https://saira34-ecobotanica-api.hf.space/identify-flower", {
          method: "POST",
          body: formData,
        }).then(res => res.json())
      ]);

      console.log("Plant Result:", plantResult);
      console.log("Flower Result:", flowerResult);

      // Process results
      let bestResult = null;
      let modelType = "unknown";

      // Check if plant model succeeded and has good confidence
      if (plantResult.status === 'fulfilled' && plantResult.value.success) {
        if (plantResult.value.confidence > 60) {
          bestResult = {
            type: "plant",
            data: plantResult.value,
            confidence: plantResult.value.confidence
          };
          modelType = "plant";
        }
      }

      // Check if flower model succeeded and has good confidence
      if (flowerResult.status === 'fulfilled' && flowerResult.value.success) {
        if (flowerResult.value.confidence > 60) {
          // If we already have a plant result, choose the one with higher confidence
          if (!bestResult || flowerResult.value.confidence > bestResult.confidence) {
            bestResult = {
              type: "flower", 
              data: flowerResult.value,
              confidence: flowerResult.value.confidence
            };
            modelType = "flower";
          }
        }
      }

      // If we found a good result, get detailed analysis from OpenRouter
      if (bestResult) {
        console.log("🌿 Getting detailed analysis from AI...");
        
        const detailedAnalysis = await getDetailedAnalysis(bestResult);
        
        setClassificationResult({
          success: true,
          message: detailedAnalysis,
          rawData: bestResult.data,
          modelUsed: modelType,
          confidence: bestResult.confidence,
          detailedReport: detailedAnalysis
        });

        return { 
          success: true, 
          message: detailedAnalysis,
          modelUsed: modelType,
          confidence: bestResult.confidence,
          detailedReport: detailedAnalysis
        };
      }

      // If no good results from either model
      const fallbackMessage = `🔍 I'm not very confident about this image. \n\nThis could be:\n• A plant or flower not in my database\n• A low-quality or unclear image\n• Multiple plants in one photo\n\nTry uploading a clearer image of a single plant or flower!`;
      
      setClassificationResult({
        success: false,
        message: fallbackMessage,
        modelUsed: "none"
      });

      return { 
        success: false, 
        message: fallbackMessage 
      };

    } catch (err) {
      console.error("❌ Classification Error:", err);
      
      const errorMsg = "🌿 Connection error. Please check your internet and try again.";
      setError(errorMsg);

      return { 
        success: false, 
        message: errorMsg 
      };
    } finally {
      setLoading(false);
    }
  };

  // Get detailed analysis from OpenRouter AI
  const getDetailedAnalysis = async (bestResult) => {
    try {
      const { type, data } = bestResult;
      
      let identification = "";
      let additionalInfo = "";

      // SAFELY extract identification information
      if (type === "plant") {
        identification = `Plant: ${data.plant_type || "Unknown Plant"}`;
        additionalInfo = `Confidence: ${data.confidence}%`;
      } else if (type === "flower") {
        identification = `Flower: ${data.prediction ? data.prediction.replace(/_/g, ' ').toUpperCase() : "Unknown Flower"}`;
        additionalInfo = `Confidence: ${data.confidence}%`;
      } else {
        identification = "Unknown Plant/Flower";
        additionalInfo = "Confidence: Unknown";
      }

      console.log("🌿 Sending to OpenRouter:", { identification, additionalInfo });

      const fullPrompt = `You are a professional botanist and plant care expert. Provide a COMPREHENSIVE analysis of the following plant/flower:

**IDENTIFIED PLANT/FLOWER:**
${identification}
${additionalInfo}

Please generate a DETAILED REPORT with the following sections:

**🌿 PLANT IDENTIFICATION:**
- Common Name & Scientific Name
- Family & Genus
- Plant Type (Annual/Perennial/Shrub/Tree/etc.)

**📊 BASIC CHARACTERISTICS:**
- Growth Habit & Size
- Leaf Structure & Color
- Flower Characteristics (if applicable)
- Special Features

**🌍 GROWING CONDITIONS:**
- **Optimal Growing Seasons:** (Specific months/seasons)
- **Climate Requirements:** (Tropical/Temperate/Desert/etc.)
- **Hardiness Zones:** (If known)

**🏡 ENVIRONMENT SUITABILITY:**
- **Indoor/Outdoor:** Clear recommendation with reasoning
- **Light Requirements:** (Full sun/Partial shade/Shade)
- **Space Requirements:** (Container size/Garden space)

**⚠️ TOXICITY ASSESSMENT:**
- **Toxicity Level:** (Non-toxic/Mildly toxic/Highly toxic)
- **Toxic Parts:** (Leaves/Stems/Flowers/Fruits/etc.)
- **Effects on Humans/Pets:** (Specific symptoms if toxic)
- **Safety Precautions:** (Handling & placement advice)

**💧 CARE & MAINTENANCE:**
- **Watering Schedule:** (Detailed frequency & amount)
- **Soil Type:** (Specific soil requirements)
- **Fertilization:** (Type & schedule)
- **Pruning Needs:** (When & how to prune)

**🌱 PROPAGATION METHODS:**
- Best propagation techniques
- Ideal timing for propagation

**🍃 COMMON USES:**
- Culinary uses (if any)
- Medicinal properties (if any)
- Ornamental value
- Environmental benefits

**🚨 SPECIAL CONSIDERATIONS:**
- Common pests & diseases
- Seasonal care changes
- Troubleshooting common problems

**📝 EXPERT RECOMMENDATIONS:**
- Best for beginners/experienced gardeners?
- Overall difficulty level
- Key success factors

Please provide accurate, practical information that would help both beginner and experienced gardeners. Format the response in clear sections with emojis for better readability.`;

      const aiRes = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: fullPrompt }],
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: "Bearer API_KEY", // ADD YOUR API KEY
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = aiRes.data.choices[0].message.content;
      console.log("🌿 AI Detailed Analysis:", aiResponse);
      
      return aiResponse;

    } catch (error) {
      console.error("❌ OpenRouter API Error:", error);
      
      // SAFE fallback - don't try to access undefined properties
      let fallbackMessage = "";
      
      if (bestResult.type === "plant") {
        const plantType = bestResult.data.plant_type || "Unknown Plant";
        fallbackMessage = `
🌿 **PLANT IDENTIFIED!**

**Plant:** ${plantType}
**Confidence:** ${bestResult.data.confidence || "Unknown"}%

**Status:** Plant identification successful!

*Note: Detailed AI analysis unavailable. Please try again later.*
        `.trim();
      } else if (bestResult.type === "flower") {
        const flowerType = bestResult.data.prediction ? bestResult.data.prediction.replace(/_/g, ' ').toUpperCase() : "Unknown Flower";
        fallbackMessage = `
🌸 **FLOWER IDENTIFIED!**

**Flower:** ${flowerType}
**Confidence:** ${bestResult.data.confidence || "Unknown"}%

**Status:** Flower identification successful!

*Note: Detailed AI analysis unavailable. Please try again later.*
        `.trim();
      } else {
        fallbackMessage = "Identification completed but detailed analysis failed. Please try again.";
      }
      
      return fallbackMessage;
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
      }}
    >
      {children}
    </PlantIdentification.Provider>
  );
};

export const usePlantIdentification = () => {
  const context = useContext(PlantIdentification);
  if (!context) {
    throw new Error(
      "usePlantIdentification must be used inside PlantIdentificationProvider"
    );
  }
  return context;
};