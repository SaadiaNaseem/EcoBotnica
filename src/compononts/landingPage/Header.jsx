import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white border-b border-[#eef5f0] sticky top-0 z-50 backdrop-blur-md"
      style={{
        boxShadow: "0 4px 20px rgba(90, 138, 102, 0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="text-4xl animate-float">🌿</div>
          <div>
            <h1 className="text-2xl font-bold text-[#2d5a3d]">EcoBotanica</h1>
            <p className="text-xs text-[#5a8a66]">AI Plant Care Companion</p>
          </div>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[#2d5a3d] hover:text-[#5a8a66] transition-colors font-medium">
            Features
          </a>
          <a href="#about" className="text-[#2d5a3d] hover:text-[#5a8a66] transition-colors font-medium">
            About
          </a>
        </nav>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(90, 138, 102, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-[#5a8a66] text-white rounded-[20px] font-medium transition-all"
        >
          Get Started
        </motion.button>
      </div>
    </motion.header>
  )
}
