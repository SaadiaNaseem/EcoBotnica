import React from "react";

const FilterDropdown = ({ value, onChange }) => {
  const filters = [
    "All",
    "Abuse",
    "Spam", 
    "Misinfo",
    "Other"
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
    >
      {filters.map(filter => (
        <option key={filter} value={filter}>
          {filter}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;