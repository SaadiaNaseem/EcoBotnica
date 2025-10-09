import React from "react";
import { motion } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const EAdashOrderDetails = ({ orders = [] }) => {
  const hasOrders = orders && orders.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Recent Orders</h3>

      {hasOrders ? (
        <ul>
          {orders.map((item, i) => (
            <motion.li
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={listVariants}
              className="flex justify-between border-b py-2 text-gray-600"
            >
              <span>{item.text}</span>
              <span className="text-sm text-gray-400">{item.time}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400 text-center py-6 italic">
          No orders yet
        </div>
      )}
    </div>
  );
};

export default EAdashOrderDetails;