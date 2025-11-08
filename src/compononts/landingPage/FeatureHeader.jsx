import React from "react";
import { motion } from "framer-motion";

export default function FeatureHeader() {
  return (
    <section className="w-full text-center py-16 bg-[#f8faf8]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto px-6"
      >
        {/* Small Title */}
        <p className="text-sm uppercase tracking-[2px] text-green-700 font-semibold mb-3">
          Our Ecosystem
        </p>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4">
          Nine Powerful Features
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-lg leading-relaxed">
          Everything you need to nurture, understand, and grow your plant
          collection with intelligent AI assistance.
        </p>
      </motion.div>
    </section>
  );
}
