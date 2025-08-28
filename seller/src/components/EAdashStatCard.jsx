import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EAdashStatCard = ({ title, value, icon, delay = 0, link }) => {
  const navigate = useNavigate();

  const iconMap = {
    lock: "🔒",
    users: "👥",
    dollar: "💲",
    add: "➕",
  };

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-gray-800 
                 hover:shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-14 h-14 flex items-center justify-center bg-green-100 rounded-full text-green-600 text-3xl">
        {iconMap[icon] || "❓"}
      </div>
      <h4 className="mt-3 font-medium">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </motion.div>
  );
};

export default EAdashStatCard;
