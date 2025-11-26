// src/components/complaints/FilterDropdown.jsx
import React from "react";

const FilterDropdown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
      aria-label="Filter complaints"
    >
      <option value="All">All</option>
      <option value="Spam">Spam</option>
      <option value="Flagged Content">Flagged Content</option>
      <option value="Policy Violation">Policy Violation</option>
      <option value="Other">Other</option>
    </select>
  );
};

export default FilterDropdown;