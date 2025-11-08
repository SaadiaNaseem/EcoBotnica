import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ModuleCard({ title, description, image, path }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative overflow-hidden rounded-2xl shadow-lg bg-white group cursor-pointer"
    >
      {/* Background Image */}
      <motion.img
        src={image}
        alt={title}
        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(path)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-md transition-all duration-300"
        >
          Explore
        </motion.button>
      </motion.div>

      {/* Card Details */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Animated underline */}
      <motion.div
        layoutId={`underline-${title}`}
        className="absolute bottom-0 left-0 h-1 bg-green-500 w-0 group-hover:w-full transition-all duration-500"
      />
    </motion.div>
  );
}
