"use client"

import { motion } from "framer-motion"
import ModuleCard from "./module-card"

export default function ModuleGrid({ modules, onModuleClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <section id="features" className="w-full relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-premium pointer-events-none" />

      {/* Animated decorative circles */}
      <motion.div
        className="absolute top-32 -left-32 w-64 h-64 rounded-full opacity-3"
        style={{ background: "radial-gradient(circle, #5a8a66 0%, transparent 70%)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-32 -right-32 w-80 h-80 rounded-full opacity-3"
        style={{ background: "radial-gradient(circle, #2d5a3d 0%, transparent 70%)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[#5a8a66] font-semibold text-sm uppercase tracking-widest mb-4">Our Ecosystem</p>
          <h3 className="text-4xl sm:text-5xl font-bold text-[#2d5a3d] mb-6">Nine Powerful Features</h3>
          <p className="text-[#5a8a66] text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to nurture, understand, and grow your plant collection with intelligent AI assistance
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} onModuleClick={onModuleClick} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
