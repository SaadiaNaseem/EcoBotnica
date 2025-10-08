import React, { createContext, useState } from "react";
import axios from "axios";

export const MistakeContext = createContext();

export const MistakeProvider = ({ children }) => {
  const [mistakes, setMistakes] = useState([]);
  const [loadingMistakes, setLoadingMistakes] = useState(false);

  const fetchMistakes = async (gptText) => {
    setLoadingMistakes(true);
    const prompt = `
You are a plant expert.
Based on the following plantation guide, identify atleast 3 most common beginner planting mistakes related to this specific plant.

The response should be:
1. Clear and simple (1 line each)
2. Focused on real planting errors (like overwatering, wrong sunlight, etc.)
3. Without any introduction or summary

Here is the plantation guide:
"${gptText}"
`;

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: "key here",
            "Content-Type": "application/json",
          },
        }
      );

      const raw = res.data.choices[0].message.content;
      const points = raw
        .split("\n")
        .filter((line) => line.trim() && (line.startsWith("1.") || line.startsWith("-")));

      setMistakes(points);
    } catch (err) {
      setMistakes(["❌ Error fetching common mistakes."]);
    }

    setLoadingMistakes(false);
  };

  return (
    <MistakeContext.Provider value={{ mistakes, loadingMistakes, fetchMistakes }}>
      {children}
    </MistakeContext.Provider>
  );
};