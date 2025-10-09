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
        <ul className="space-y-3">
          {orders.map((order, i) => (
            <motion.li
              key={order.id || i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={listVariants}
              className="flex justify-between items-start border-b pb-3 text-gray-600"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{order.text}</p>
                {order.customer && (
                  <p className="text-xs text-gray-400 mt-1">Customer: {order.customer}</p>
                )}
              </div>
              <span className="text-sm text-gray-400 ml-2">{order.time}</span>
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