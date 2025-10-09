import React, { useContext, useEffect } from "react";
import { AiContext } from "../context/AiContext";
import AiPromptInput from "../compononts/AiPromptInput";
import AiResponseBox from "../compononts/AiResponseBox";
import QuickStartGrid from "../compononts/QuickStartGrid";
import Title from "../compononts/Title";
import RightSidebar from "../compononts/RightSidebar";

const AiPlantationGuide = () => {
  const { response, setResponse, lastPrompt } = useContext(AiContext);

  // Whenever the user submits a new prompt → clear the old response first
  useEffect(() => {
    if (lastPrompt) {
      // Clear the old response immediately
      setResponse("");

      // Give a short delay before generating new AI response
      const timer = setTimeout(() => {
        // Call your AI generation logic here (if it’s in AiContext)
        // Example: generateAiResponse(lastPrompt);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [lastPrompt]);

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Main Content (80%) */}
      <div className="w-[80%] p-6">
        <Title text1="PLANTATION" text2="GUIDE" />

        {/* Input Component */}
        <AiPromptInput position="bottom" />

        {/* Conditional Rendering — show new response or quick start */}
        {response ? (
          <div className="mt-6 animate-fadeIn">
            <AiResponseBox />
          </div>
        ) : (
          <QuickStartGrid />
        )}
      </div>

      {/* Right Sidebar (20%) */}
      <div className="w-[30%] border-l border-gray-300 bg-white p-4">
        <RightSidebar />
      </div>
    </div>
  );
};

export default AiPlantationGuide;
