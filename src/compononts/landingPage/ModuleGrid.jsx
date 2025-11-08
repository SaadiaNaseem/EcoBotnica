import React from "react";
import { motion } from "framer-motion";
import ModuleCard from "./ModuleCard";

export default function ModuleGrid({ modules }) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-6 py-12"
    >
      {modules.map((mod, index) => (
        <ModuleCard
          key={index}
          title={mod.title}
          description={mod.description}
          image={mod.image}
          path={mod.path}
        />
      ))}
    </motion.section>
  );
}
