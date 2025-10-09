// src/components/LocationSelector.jsx
import React from "react";

const locations = [
  "Islamabad",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
];

const LocationSelector = ({ location, setLocation }) => {
  return (
    <div className="mb-4">
      <label className="font-medium text-gray-700 mr-2">Select Location:</label>
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="">-- Choose city --</option>
        {locations.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
