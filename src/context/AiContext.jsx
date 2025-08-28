// context/AiContext.jsx
import React, { createContext, useState } from "react";
import axios from "axios";

export const AiContext = createContext();

export const AiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const fetchPlantationGuide = async (prompt) => {
    setLoading(true);
    const fullPrompt = `
You are a plant care assistant. The user will provide a single plant name.

If the input is a valid plant name, generate a step-by-step plantation guide including:
🌿 Plant Name: [Insert Plant Name Here]
• Generate a **step-by-step plantation guide** using easy, clear bullet points** with a **little bit of detail** for each step below.

Make sure each step includes **2 to 4 beginner-friendly bullet points**.

• Step 1: Selecting the Right Location 
  - Mention sunlight requirements (e.g., full sun, partial shade).  
  - Talk about whether the plant is suitable for indoor or outdoor.  
  - Ensure the area is protected from strong winds and flooding.  

• Step 2: Preparing the Soil 
  - Explain the ideal soil type (e.g., well-draining, loamy).  
  - Recommend adding compost or organic matter.  
  - Mention if the plant prefers slightly acidic, neutral, or alkaline soil.  

• Step 3: Planting the Seeds or Seedlings 
  - Describe how deep and how far apart to plant seeds or seedlings.  
  - Suggest best season or temperature for planting.  
  - Remind to gently press soil after planting to remove air pockets.  

• Step 4: Watering 
  - State how often to water and how much is needed.  
  - Explain whether the soil should stay moist or dry out between watering.  
  - Mention to avoid overwatering or waterlogging.  

• Step 5: Initial Care After Planting
  - Recommend temporary shade for delicate plants.  
  - Suggest monitoring for pests or leaf wilting.  
  - Mention keeping the soil moist and avoiding disturbance.  

• Step 6: Ongoing Maintenance 
  - Advise on regular watering, pruning, or fertilizing needs.  
  - Suggest how to deal with common pests or diseases.  
  - Encourage removing weeds and trimming dead parts.  
  - Mention if seasonal care or repotting is needed.

BUT — if the input is not a valid plant name or if it seems like a general question or sentence, then reply with:
❌ You can only search by plant name. Please enter a valid plant name.

Here is the user input: "${prompt}"
`;

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: fullPrompt }],
        },
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(res.data.choices[0].message.content);
    } catch (err) {
      setResponse("❌ Error fetching data. Please try again.");
    }
    setLoading(false);
  };

  return (
    <AiContext.Provider value={{ fetchPlantationGuide, response, loading }}>
      {children}
    </AiContext.Provider>
  );
};
