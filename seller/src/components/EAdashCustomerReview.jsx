// src/components/EAdashCustomerReview.jsx
import React from "react";
import { motion } from "framer-motion";
import { reviews } from "../data/EAdashDummyData";

const EAdashCustomerReview = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="font-semibold text-gray-800 mb-3">
        Customer Review
      </h3>
      <div className="mb-4">
        ⭐⭐⭐⭐☆ <span className="text-gray-500">4.0 out of 5</span>
      </div>
      {reviews.map((r, i) => (
        <div key={i} className="mb-3">
          <div className="flex justify-between mb-1">
            <span>{r.label}</span>
            <span>{r.value}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${r.value}%` }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-green-500 h-2 rounded-full"
            ></motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EAdashCustomerReview;
