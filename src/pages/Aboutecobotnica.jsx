import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-5 md:px-20 py-16 space-y-20 mt-0">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center space-y-5"
      >
        <h1 className="text-4xl md:text-5xl font-bold hover:scale-105 transition-all duration-300">
          About EcoBotanica <span className="animate-pulse">🌿🤖</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl">
          EcoBotanica is an AI-powered platform for plant health, growth optimization, and care. 
          It provides instant plant identification, disease diagnosis, personalized care guides, 
          and a dedicated marketplace — all in one place for plant enthusiasts! 🌱✨
        </p>
      </motion.div>

      {/* AI Assistance Section */}
      <motion.div
        className="md:flex md:items-center md:gap-10 space-y-8 md:space-y-0"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="md:w-1/2">
          <motion.img
            src={assets.Care} // AI illustration image
            alt="AI Assistance"
            className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <motion.h2
            className="text-3xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Smart AI Assistance 🤖
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Get instant help with plant identification, disease detection, and care guidance. 
            Our AI assistant provides tailored advice based on your plant and location, making care simple and effective. 🌱✨
          </motion.p>
        </div>
      </motion.div>

      {/* Marketplace Section */}
      <motion.div
        className="md:flex md:items-center md:gap-10 space-y-8 md:space-y-0 md:flex-row-reverse"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="md:w-1/2">
          <motion.img
            src={assets.Ecom} // Marketplace illustration image
            alt="Marketplace"
            className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <motion.h2
            className="text-3xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Marketplace & Community 🛒🌿
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Explore our plant-focused marketplace and community platform. Buy, sell, and review plant products, share knowledge, and crowdsource solutions for plant care problems — all verified and safe. 🌸💚
          </motion.p>
        </div>
      </motion.div>

      {/* Community Section */}
      <motion.div
        className="md:flex md:items-center md:gap-10 space-y-8 md:space-y-0"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="md:w-1/2">
          <motion.img
            src={assets.Community} // Community illustration image
            alt="Community"
            className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <motion.h2
            className="text-3xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Community 🌿
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Join plant lovers, share issues, and get verified solutions. Connect with others in a safe environment where you can ask questions, share knowledge, and collaborate on plant care journeys. 🌸💚
          </motion.p>
        </div>
      </motion.div>

      {/* Platform Overview / Fun Fact Section */}
      <motion.div
        className="bg-green-50 rounded-2xl p-10 text-center space-y-5 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Why EcoBotanica? 🤔
        </motion.h2>
        <motion.p
          className="text-gray-700 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          By combining AI-driven insights, interactive AR experiences, and a dedicated plant marketplace, 
          EcoBotanica empowers users to grow healthier plants while fostering a collaborative, engaging gardening community. 🌱💚
        </motion.p>
      </motion.div>

      {/* Design & Process Section */}
      <motion.div
        className="space-y-6 max-w-4xl mx-auto text-gray-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <motion.h2
          className="text-3xl font-bold text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Design & Development ⚙️
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <strong>Design Methodology:</strong> EcoBotanica follows Object-Oriented Programming (OOP) principles for modularity, reusability, and maintainability. React components, context-based state management, and modular backend routes ensure a scalable architecture.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <strong>Software Process Model:</strong> We adopt the Incremental Development Model, building and delivering each platform feature progressively. Continuous feedback, testing, and integration enable smooth improvements without disrupting the overall workflow.
        </motion.p>
      </motion.div>

    </div>
  );
}
