// context/AiContext.jsx
import React, { createContext, useState } from "react";
import axios from "axios";

export const AiContext = createContext();

export const AiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [activePrompt, setActivePrompt] = useState("");

  // 🌿 Main Function to Generate Response
  const fetchPlantationGuide = async (prompt) => {
    if (!prompt.trim()) return;

    // 🧹 Clear previous response before fetching new one
    setResponse("");
    setActivePrompt(prompt);
    setLoading(true);

    const fullPrompt = `
You are a plant care assistant. The user will provide either:

1️⃣ A plant name (e.g., “Rose”, “Tulsi”, “Tomato”)
2️⃣ A planting-related query (e.g., “How to grow herbs in pots”, “How to plant roses in cold weather”).

🌿 Your Response Rules
first check is the question or query related to plants , if yes then go for response else simply say " please ask plant related question , 
like i want to grow this how to plant else answering other questions are not in my domain , Thank you : Happy Gardning 🌿"

If input is a plant name, generate a beginner-friendly, step-by-step plantation guide.
If input is a planting-related query, create a personalized step-by-step guide according to that context.

Each guide must include 6 clearly formatted sections, using bold headings and short, clear bullet points for easy reading.

🌼 Response Format

🌿 Plant/Topic: [Insert plant name or topic]

🌳 Step 1: Selecting the Right Location
• Choose a sunny spot with at least 5–6 hours of light.
• Avoid areas with strong winds or waterlogging.

🌱 Step 2: Preparing the Soil
• Loosen the soil and remove weeds or stones.
• Mix compost or organic fertilizer to enrich the soil.
• Slightly wet the soil before planting.

🌸 Step 3: Planting the Seeds or Seedlings
• Dig a small hole about 2–3 inches deep (adjust for plant type).
• Place the seed or seedling gently inside.
• Cover lightly with soil and pat it down gently.

💧 Step 4: Watering
• Water the area evenly right after planting.
• Keep soil moist but not soggy.
• Avoid watering leaves directly.

🌞 Step 5: Initial Care After Planting
• Provide partial shade for 2–3 days if the sun is too strong.
• Watch for pests or leaf spots in early growth.

🌻 Step 6: Ongoing Maintenance
• Water regularly (every 2–3 days or when soil feels dry).
• Add compost every 3–4 weeks.
• Trim dead or dry leaves to encourage healthy growth.
• Support tall plants with small stakes if needed.


Here is the user input: "${prompt}"
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
            Authorization: "Bearer ", // 🔑 your actual API key here
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(res.data.choices[0].message.content);
    } catch (err) {
      console.error(err);
      setResponse("❌ Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AiContext.Provider
      value={{
        fetchPlantationGuide,
        response,
        setResponse,
        loading,
        activePrompt,
        setActivePrompt,
      }}
    >
      {children}
    </AiContext.Provider>
  );
};