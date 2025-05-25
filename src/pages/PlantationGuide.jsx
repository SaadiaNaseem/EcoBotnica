// pages/AiPlantationGuide.jsx
import React, { useContext, useState } from "react";
import { AiContext } from "../context/AiContext";
import AiPromptInput from "../compononts/AiPromptInput";
import AiResponseBox from "../compononts/AiResponseBox";
import { assets } from "../assets/assets";
import Title from "../compononts/Title";

const PlantationGuide = () => {
  const { response } = useContext(AiContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white px-4 pt-4 pb-3">
      <div className="text-2xl mb-4">
        <Title text1={"PLANTATION"} text2={"GUIDE"} />
      </div>

      {/* div-B placeholder (if needed) */}
      <div className="mb-4"></div>

      {/* Input Box always between div-B and div-C */}
      <div className="mb-4">
        <AiPromptInput position="bottom" />
      </div>

      {/* div-A: Main Content */}
      <div className="flex flex-col lg:flex-row w-full gap-4">
        {/* div-C and div-D */}
        <div className="flex flex-col lg:flex-row w-full gap-4">
          {/* div-C: Output Box */}
          <div className="w-full lg:w-[70%] max-h-[600px] overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center scroll-pt-4">
            {!response ? (
              <img
                src={assets.logoResized}
                alt="Logo"
                className="w-40 opacity-30 mx-auto"
              />
            ) : (
              <AiResponseBox />
            )}
          </div>

          {/* div-D */}
          <div className="w-full lg:w-[30%] flex flex-col lg:gap-4 mt-4 lg:mt-0">
            <div className="flex flex-col md:flex-row lg:flex-col gap-4">

              {/* div-E: Image (hidden on small screens) */}
              <div className="hidden md:block border border-gray-300 rounded-lg overflow-hidden md:w-1/2 lg:w-full">
                <img
                  src={assets.PlantGuide}
                  alt="Example"
                  className="w-full h-auto"
                />
              </div>

              {/* div-F: Always visible */}
              <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm md:w-1/2 lg:w-full">
                <details className="w-full">
                  <summary className="font-semibold text-gray-700 cursor-pointer">
                    Common Planting Mistakes
                  </summary>
                  <ul className="mt-2 list-disc list-inside text-gray-600">
                    <li>Overwatering</li>
                    <li>Poor soil drainage</li>
                    <li>Not enough sunlight</li>
                    <li>Wrong pot size</li>
                  </ul>
                </details>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div> // Correctly closes the top-level div
  );
};

export default PlantationGuide;
