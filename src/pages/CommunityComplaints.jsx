// src/pages/CommunityComplaints.jsx
import React, { useMemo, useState } from "react";
import { demoComplaints } from "../cdata/complaintsData";
import FilterDropdown from "../compononts/complaints/FilterDropdown";
import ComplaintsTable from "../compononts/complaints/ComplaintsTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

/**
 * CommunityComplaints page
 * - Uses demo data from data/complaintsData.js
 * - Provides filter, actions, and simulated server calls (with comments where to replace)
 */
const CommunityComplaints = () => {
  // Local state holds active complaints list (client-side only)
  const [complaints, setComplaints] = useState(demoComplaints);
  const [filter, setFilter] = useState("All");

  // Filtered list (memoized)
  const filtered = useMemo(() => {
    if (filter === "All") return complaints;
    return complaints.filter((c) => c.reason.toLowerCase() === filter.toLowerCase());
  }, [filter, complaints]);

  // Mark as resolved -> remove this complaint from list
  const handleResolve = (id) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
    toast.success("Marked as resolved");
    // TODO (backend): POST /complaints/:id/resolve => update DB, return 200
  };

  // Block user -> remove all complaints against that user and simulate account removal
  const handleBlockUser = (userId) => {
    // remove complaints against that user
    setComplaints((prev) => prev.filter((c) => c.againstUserId !== userId));
    toast.success("User blocked and related complaints removed (simulated)");
    // TODO (backend): DELETE /users/:userId or set user.blocked = true
    // TODO (backend): Remove user's content, notify user, persist changes
  };

  // Issue a warning email (simulated)
  const handleIssueWarning = (userId) => {
    // simulate async email sending
    toast.info("Sending warning email...");
    setTimeout(() => {
      toast.success("Warning email sent (simulated)");
      // TODO (backend): POST /notifications/email { userId, templateId, placeholders }
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-6"
    >
      <ToastContainer position="top-right" />

      {/* Header + filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Community Complaints</h2>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Filter:</div>
          <FilterDropdown value={filter} onChange={setFilter} />
        </div>
      </div>

      {/* Table */}
      <ComplaintsTable
        complaints={filtered}
        onResolve={handleResolve}
        onBlockUser={handleBlockUser}
        onIssueWarning={handleIssueWarning}
      />
    </motion.div>
  );
};

export default CommunityComplaints;
