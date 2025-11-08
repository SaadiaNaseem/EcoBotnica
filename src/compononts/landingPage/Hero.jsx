"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section
      className="w-full relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/hero-botanical-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(250,248,243,0.85)] via-[rgba(239,245,240,0.75)] to-[rgba(250,248,243,0.9)] pointer-events-none" />

      {/* Deep botanical overlay with radial gradients */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-full h-full"
          style={{
            background: "radial-gradient(circle at 80% 20%, rgba(90, 138, 102, 0.15) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-full"
          style={{
            background: "radial-gradient(circle at 20% 80%, rgba(45, 90, 61, 0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Animated background elements - floating leaves effect */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #5a8a66 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -bottom-10 left-10 w-80 h-80 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #2d5a3d 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, delay: 2, ease: "easeInOut" }}
      />

      {/* Animated botanical accent circles */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #d4af37 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="text-[#5a8a66] font-semibold text-sm uppercase tracking-widest mb-4">
            Welcome to Nature's Future
          </p>
          <h2 className="text-5xl sm:text-7xl font-bold text-[#2d5a3d] mb-6 leading-tight drop-shadow-sm">
            Nurture Your Plants with{" "}
            <span className="text-[#d4af37] relative">
              AI
              <motion.span
                className="absolute inset-0 opacity-30 blur-lg"
                style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-[#5a8a66] mb-8 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-sm"
        >
          From identification to diagnosis, grow any plant with confidence — flowers, herbs, trees, succulents, indoor
          plants & more. Your AI companion for the complete plant care journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 16px 40px rgba(90, 138, 102, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-[#5a8a66] text-white rounded-[20px] font-semibold text-lg transition-all hover:bg-[#4a7a56]"
          >
            Explore Features
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#eef5f0" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-[#2d5a3d] border-2 border-[#5a8a66] rounded-[20px] font-semibold text-lg transition-all"
          >
            Learn More
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 pt-12 border-t border-[#eef5f0]"
        >
          <p className="text-[#5a8a66] text-sm uppercase tracking-wider mb-8 font-semibold">
            Loved by plant enthusiasts worldwide — flowers, herbs, trees, indoor plants & more
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { emoji: "🌸", label: "Flowers" },
              { emoji: "🌿", label: "Herbs" },
              { emoji: "🌳", label: "Trees" },
              { emoji: "🪴", label: "Indoor Plants" },
              { emoji: "🌵", label: "Succulents" },
            ].map((item, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, delay: i * 0.1, repeat: Number.POSITIVE_INFINITY }}
                className="text-5xl hover:scale-125 transition-transform filter drop-shadow-md"
                title={item.label}
              >
                {item.emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
