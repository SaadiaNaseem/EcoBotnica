import React, { useContext } from "react";
import { VisualAidContext } from "../context/VisualAidContext";
import { AiContext } from "../context/AiContext";
import { useNavigate } from "react-router-dom";

const VisualAidBox = () => {
  const { generateVisuals } = useContext(VisualAidContext);
  const { response } = useContext(AiContext);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    await generateVisuals(response);
    navigate("/visual-aid");
  };

  return (
    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm">
      <img
        src="/assets/PlantGuide.png" // 📌 replace with actual asset
        alt="Guide Visual"
        className="rounded mb-4"
      />
      <button
        onClick={handleGenerate}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        See Visual Aids
      </button>
    </div>
  );
};

export default VisualAidBox;
