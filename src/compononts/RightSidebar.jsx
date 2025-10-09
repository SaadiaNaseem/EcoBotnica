import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiContext } from "../context/AiContext";
import { VisualAidContext } from "../context/VisualAidContext";
import { MistakeContext } from "../context/MistakeContext";
import { assets } from "../assets/assets";

const RightSidebar = () => {
  const { response } = useContext(AiContext);
  const { generateVisuals } = useContext(VisualAidContext);
  const { mistakes, loadingMistakes, fetchMistakes } = useContext(MistakeContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleVisualClick = async () => {
    if (!response) return alert("⚠️ Please generate a plantation guide first.");
    await generateVisuals(response);
    navigate("/visual-aid");
  };

  const handleMistakeClick = async () => {
    setDropdownOpen(!dropdownOpen);
    if (!response) return;
    await fetchMistakes(response);
  };

  return (
    <div className="flex flex-col space-y-6 bg-[#F4FFF4] p-4 rounded-xl shadow-sm">
      {/* 1️⃣ Visual Aid Section */}
      <div className="text-center">
        <img
          src={assets.PlantGuide}
          alt="Visual Guide"
          className="w-full h-[190px] object-cover rounded-lg mb-3 shadow-[0_4px_10px_rgba(34,197,94,0.5)] transition-transform duration-500 hover:scale-105"
        />
        <button
          onClick={handleVisualClick}
          className="bg-black text-white rounded-full px-4 py-2 w-full hover:bg-gray-800 transition"
        >
          Visual Aids
        </button>
      </div>

      {/* 2️⃣ Plant Image Section */}
      <div>
        <img
          src={assets.plant8}
          alt="Plant"
          className="w-full h-[190px] object-cover rounded-lg shadow-[0_4px_10px_rgba(34,197,94,0.5)] transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* 3️⃣ Common Mistakes Section */}
      <div className="border border-gray-200 rounded-lg p-3 bg-white">
        <button
          onClick={handleMistakeClick}
          className="w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white text-xs font-medium rounded-[20px] py-[5px] px-3 transition flex items-center justify-center gap-3"
        >
          View Common Planting Mistakes
          <span className="text-sm pt-[1px]">▼</span>
        </button>


        {dropdownOpen && (
          <div className="mt-3 text-sm text-gray-700 space-y-2 max-h-[150px] overflow-y-auto">
            {loadingMistakes ? (
              <p>Loading...</p>
            ) : (
              mistakes.map((m, idx) => (
                <p
                  key={idx}
                  className="border-b border-gray-200 pb-1 last:border-none"
                >
                  {m}
                </p>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
