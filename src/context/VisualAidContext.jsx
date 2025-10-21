import React, { createContext, useState } from "react";
import axios from "axios";

export const VisualAidContext = createContext();

export const VisualAidProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const generateVisuals = async (gptText) => {
    setLoading(true);
    setImages([]);
    setProgress("Generating visual from guide...");

    try {
      // 🧠 Step 1 — Create one descriptive image prompt
      const combinedPrompt = `
        A single detailed illustration showing all these gardening steps together:
        ${gptText}.
        The image should look like a realistic garden guide scene — soil preparation,
        planting, watering, and care shown together in one frame. 
        Bright, clear daylight and natural style.
      `;

      // 🖼️ Step 2 — Call OpenRouter image generation endpoint
      const res = await axios.post(
        "https://openrouter.ai/api/v1/images", // ✅ CORRECT endpoint
        {
          model: "black-forest-labs/flux-schnell", // ✅ image-capable model
          prompt: combinedPrompt,
          size: "1024x1024",
          response_format: "url",
        },
        {
          headers: {
            Authorization: "Bearer API_KEY",
            "Content-Type": "application/json",
          },
        }
      );

      const imageUrl = res.data?.data?.[0]?.url;
      if (!imageUrl) throw new Error("No image URL returned from image model");

      setImages([{ prompt: combinedPrompt, imageUrl }]);
      setProgress("✅ Visual guide generated successfully!");
      console.log("🖼️ Image URL:", imageUrl);
    } catch (error) {
      console.error("❌ Error generating visual:", error);
      setProgress("Failed to generate visual. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VisualAidContext.Provider value={{ images, loading, progress, generateVisuals }}>
      {children}
    </VisualAidContext.Provider>
  );
};
