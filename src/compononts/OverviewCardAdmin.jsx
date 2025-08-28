import React from "react";

const OverviewCardAdmin = ({ title, data }) => {
  const sign = data.change >= 0 ? "+" : "";
  const trendColor = data.change >= 0 ? "text-green-700" : "text-red-500";

  return (
    <div className="bg-green-50 p-4 rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <p className="text-sm text-green-700">{title}</p>
      <h2 className="text-2xl font-bold text-green-900">{data.value.toLocaleString()}</h2>
      <p className={`text-xs mt-1 ${trendColor}`}>
        {sign}{data.change.toFixed(2)}%
      </p>
    </div>
  );
};

export default OverviewCardAdmin;
