// pages/AiPlantationGuide.jsx
import React, { useContext } from "react";
import { AiContext } from "../context/AiContext";
import AiPromptInput from "../compononts/AiPromptInput";
import AiResponseBox from "../compononts/AiResponseBox";

const PlantationGuide = () => {
  const { response } = useContext(AiContext);

  return (
    <div className="min-h-screen bg-white">
      {!response && <AiPromptInput position="center" />}
      {response && (
        <>
          <AiResponseBox />
          <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner">
            <AiPromptInput position="bottom" />
          </div>
        </>
      )}
    </div>
  );
};

export default PlantationGuide;
