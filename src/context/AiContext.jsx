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
I want to plant ${prompt}.
Please give me a step-by-step guide including:
• Step 1: Selecting the right location
• Step 2: Preparing the soil
• Step 3: Planting the seeds or seedlings
• Step 4: Watering
• Step 5: Initial care after planting
• Step 6: Ongoing maintenance
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
