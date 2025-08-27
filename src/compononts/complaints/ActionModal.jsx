// src/components/complaints/ActionModal.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * Generic confirmation modal.
 * Props:
 *  - title, message
 *  - onConfirm, onCancel
 *  - confirmLabel (default "Yes"), cancelLabel (default "Cancel")
 */
const ActionModal = ({ title, message, onConfirm, onCancel, confirmLabel = "Yes", cancelLabel = "Cancel" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6"
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-black text-white px-4 py-2 rounded-[20px] hover:opacity-90 transition"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-[20px] hover:opacity-90 transition"
          >
            {cancelLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ActionModal;
