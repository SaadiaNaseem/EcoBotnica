import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import ModuleCard from "./ModuleCard"

export default function ModulesSection() {
  const navigate = useNavigate()

  const modules = [
    {
      title: "Plant Identification",
      description: "Identify plant species instantly using AI-powered recognition.",
      image: "/modules/plant-id.jpg",
      icon: "🌿",
      color: "#5a8a66",
      route: "/plant-identification",
    },
    {
      title: "Disease Diagnosis",
      description: "Detect and cure plant diseases with smart image analysis.",
      image: "/modules/disease-diagnosis.jpg",
      icon: "🩺",
      color: "#2d5a3d",
      route: "/disease-diagnosis",
    },
    {
      title: "Marketplace",
      description: "Buy and sell eco-friendly plants and gardening tools.",
      image: "/modules/marketplace.jpg",
      icon: "🛒",
      color: "#d4af37",
      route: "/marketplace",
    },
  ]

  return (
    <section id="features" className="py-24 bg-[#f9faf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-center text-[#2d5a3d] mb-12"
        >
          Explore EcoBotanica Modules
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {modules.map((module, index) => (
            <ModuleCard
              key={index}
              module={module}
              onModuleClick={(route) => navigate(route)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
