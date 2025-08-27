// src/components/complaints/ComplaintRow.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEllipsisV, FaUserSlash, FaEnvelope, FaCheck } from "react-icons/fa";
import ActionModal from "./ActionModal";

/**
 * Row for one complaint.
 * Props:
 *  - complaint: object
 *  - onResolve(id) -> remove from list
 *  - onBlockUser(userId) -> remove all complaints for that user (handled by parent)
 *  - onIssueWarning(userId) -> simulate sending warning
 */
const ComplaintRow = ({ complaint, onResolve, onBlockUser, onIssueWarning }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const menuRef = useRef();

  // close menu when clicking outside
  useEffect(() => {
    function handler(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <AnimatePresence>
        <motion.tr
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="border-b border-gray-200 hover:bg-gray-50"
        >
          <td className="py-3 px-6 align-top">{complaint.registeredBy}</td>
          <td className="py-3 px-6 align-top">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs">
                {complaint.againstUser.slice(0, 1)}
              </div>
              <div className="text-sm">{complaint.againstUser}</div>
            </div>
          </td>
          <td className="py-3 px-6 align-top">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">{complaint.reason}</span>
          </td>
          <td className="py-3 px-6 text-sm align-top max-w-[32rem] break-words">{complaint.message}</td>

          <td className="py-3 px-6 text-center align-top">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onResolve(complaint.id)}
                title="Mark as Resolved"
                className="bg-green-600 text-white px-3 py-1 rounded-full text-xs hover:bg-green-700 transition flex items-center gap-2"
              >
                <FaCheck /> <span>Resolved</span>
              </button>

              {/* Take Action dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen((s) => !s); }}
                  className="bg-black text-white p-2 rounded-full text-xs hover:opacity-90"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  <FaEllipsisV />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-40"
                    >
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setConfirmBlock(true); // show confirm modal
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FaUserSlash /> Block User
                      </button>

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onIssueWarning(complaint.againstUserId);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FaEnvelope /> Issue Warning (email)
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </td>
        </motion.tr>
      </AnimatePresence>

      {/* Confirm block modal */}
      {confirmBlock && (
        <ActionModal
          title="Block User"
          message={`Are you sure you want to block/delete user "${complaint.againstUser}"? This will remove their account.`}
          confirmLabel="Block User"
          cancelLabel="Cancel"
          onConfirm={() => {
            // simulate API call to delete user
            onBlockUser(complaint.againstUserId);
            setConfirmBlock(false);
          }}
          onCancel={() => setConfirmBlock(false)}
        />
      )}
    </>
  );
};

export default ComplaintRow;
