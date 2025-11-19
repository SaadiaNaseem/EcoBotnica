// context/plantIdentification.jsx
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

export const PlantIdentification = createContext();

export const PlantIdentificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [error, setError] = useState("");

  // Function to classify image (plant, flower, or random)
  const classifyImage = async (imageFile) => {
    setLoading(true);
    setError("");
    setClassificationResult(null);
    setPlantInfo(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // First, classify the image type
      const classificationRes = await fetch("http://127.0.0.1:5000/classify-image", {
        method: "POST",
        body: formData,
      });

      if (!classificationRes.ok) {
        throw new Error("Failed to classify image");
      }

      const classificationData = await classificationRes.json();
      console.log("Classification API Response:", classificationData);

      setClassificationResult(classificationData);

      // If it's a plant or flower, get detailed information
      if (classificationData.type === "plant" || classificationData.type === "flower") {
        await getPlantInformation(imageFile, classificationData.type);
      }

      return classificationData;

    } catch (err) {
      console.error("Error in classifyImage:", err);
      const errorMsg = "❌ Error classifying image. Please try again.";
      setError(errorMsg);
      return { type: "error", message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Function to get plant/flower information
  const getPlantInformation = async (imageFile, type) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // Use different endpoints based on image type
      const endpoint = type === "plant" 
        ? "http://127.0.0.1:5001/identify-plant"  // Plant model
        : "http://127.0.0.1:5002/identify-flower"; // Flower model

      const identificationRes = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!identificationRes.ok) {
        throw new Error(`Failed to identify ${type}`);
      }

      const identificationData = await identificationRes.json();
      console.log(`${type} Identification Response:`, identificationData);

      // Get additional information using AI
      const plantDetails = await getPlantDetailsFromAI(identificationData.plant_name, type);
      setPlantInfo({
        ...identificationData,
        ...plantDetails,
        type: type
      });

      return identificationData;

    } catch (err) {
      console.error(`Error in getPlantInformation for ${type}:`, err);
      throw err;
    }
  };

  // Function to get detailed plant information from AI
  const getPlantDetailsFromAI = async (plantName, type) => {
    try {
      const fullPrompt = `You are a plant expert. Provide detailed information about this ${type}: "${plantName}".

Please provide information in the following format:

Plant Name: [Common name]
Scientific Name: [Scientific name if available]
Family: [Plant family]
Description: [Brief description of the plant]
Care Tips:
- [Tip 1]
- [Tip 2]
- [Tip 3]
- [Tip 4]
Fun Fact: [Interesting fact about the plant]

If the plant name is not valid or recognizable, respond with: "Unable to identify this plant."

Keep the information accurate, helpful, and easy to understand for plant enthusiasts.`;

      const aiRes = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: fullPrompt }],
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: "Bearer YOUR_API_KEY_HERE", // Replace with your actual API key
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = aiRes.data.choices[0].message.content;
      
      // Parse the AI response into structured data
      return parseAIResponse(aiResponse);

    } catch (err) {
      console.error("Error getting plant details from AI:", err);
      return getDefaultPlantInfo(plantName, type);
    }
  };

  // Helper function to parse AI response
  const parseAIResponse = (response) => {
    if (response.includes("Unable to identify")) {
      return getDefaultPlantInfo("Unknown Plant", "plant");
    }

    const lines = response.split('\n');
    const result = {
      plant_name: "",
      scientific_name: "",
      family: "",
      description: "",
      care_tips: [],
      fun_fact: ""
    };

    let currentSection = "";
    
    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('Plant Name:')) {
        result.plant_name = line.replace('Plant Name:', '').trim();
      } else if (line.startsWith('Scientific Name:')) {
        result.scientific_name = line.replace('Scientific Name:', '').trim();
      } else if (line.startsWith('Family:')) {
        result.family = line.replace('Family:', '').trim();
      } else if (line.startsWith('Description:')) {
        result.description = line.replace('Description:', '').trim();
        currentSection = 'description';
      } else if (line.startsWith('Care Tips:')) {
        currentSection = 'care_tips';
      } else if (line.startsWith('Fun Fact:')) {
        result.fun_fact = line.replace('Fun Fact:', '').trim();
      } else if (line.startsWith('- ') && currentSection === 'care_tips') {
        result.care_tips.push(line.replace('- ', '').trim());
      } else if (currentSection === 'description' && line && !line.startsWith('Care Tips:')) {
        result.description += ' ' + line;
      }
    });

    // Ensure we have at least some care tips
    if (result.care_tips.length === 0) {
      result.care_tips = [
        "Provide adequate sunlight",
        "Water when soil is dry",
        "Use well-draining soil",
        "Fertilize during growing season"
      ];
    }

    return result;
  };

  // Default plant info if AI fails
  const getDefaultPlantInfo = (plantName, type) => {
    return {
      plant_name: plantName,
      scientific_name: "Unknown",
      family: "Unknown",
      description: `This appears to be a ${type}. For specific care instructions, consult a gardening expert or plant identification guide.`,
      care_tips: [
        "Provide adequate sunlight based on plant type",
        "Water according to the plant's specific needs",
        "Ensure proper soil drainage",
        "Monitor for pests and diseases"
      ],
      fun_fact: `There are thousands of ${type} species worldwide, each with unique characteristics and care requirements.`
    };
  };

  // Clear all states
  const clearResults = () => {
    setClassificationResult(null);
    setPlantInfo(null);
    setError("");
  };

  return (
    <PlantIdentification.Provider value={{
      classifyImage,
      classificationResult,
      plantInfo,
      loading,
      error,
      clearResults,
      setPlantInfo
    }}>
      {children}
    </PlantIdentification.Provider>
  );
};

// Custom hook for using the context
export const usePlantIdentification = () => {
  const context = useContext(PlantIdentification);
  if (!context) {
    throw new Error("usePlantIdentification must be used within a PlantIdentificationProvider");
  }
  return context;
};