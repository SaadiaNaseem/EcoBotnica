import React, { useContext } from "react";
import { motion } from "framer-motion";
import { BsSnow2 } from "react-icons/bs";
import { GiFlowerPot, GiCactus } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { AiContext } from "../context/AiContext";

const quickStartData = [
  {
    label: "How to plant roses in cold weather",
    icon: <BsSnow2 size={40} className="text-green-700 mx-auto mb-3" />,
  },
  {
    label: "How to grow herbs in a pot",
    icon: <GiFlowerPot size={40} className="text-green-700 mx-auto mb-3" />,
  },
  {
    label: "How to plant cactus in low sunlight",
    icon: <GiCactus size={40} className="text-green-700 mx-auto mb-3" />,
  },
  {
    label: "How to grow leafy vegetables at home",
    icon: <FaLeaf size={40} className="text-green-700 mx-auto mb-3" />,
  },
];

const QuickStartGrid = () => {
  const { fetchPlantationGuide, loading } = useContext(AiContext);

  const handleClick = async (prompt) => {
    await fetchPlantationGuide(prompt);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
      {quickStartData.map((item, index) => (
        <motion.button
          key={index}
          onClick={() => handleClick(item.label)}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          whileHover={{ scale: 1.07, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="bg-gradient-to-br from-[#e8f5e1] to-[#d7edcb]
                     hover:from-[#def2d1] hover:to-[#cfe9bb]
                     p-8 text-center rounded-2xl shadow-md
                     transition-all cursor-pointer disabled:opacity-50"
        >
          {item.icon}
          <p className="text-base font-semibold text-gray-800">{item.label}</p>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickStartGrid;
