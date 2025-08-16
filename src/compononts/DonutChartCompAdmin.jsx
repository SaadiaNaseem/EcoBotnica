import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChartCompAdmin = () => {
  const greenPalette = [
    "#bbf7d0", "#86efac", "#4ade80", "#166534",
    "#a7f3d0", "#6ee7b7", "#10b981", "#065f46",
    "#d1fae5", "#34d399", "#059669", "#064e3b"
  ];

  const data = {
    labels: ["Spam Reports", "Flagged Contents", "Policy Violation", "Other"],
    datasets: [
      {
        label: "Complaints",
        data: [52.1, 22.8, 13.9, 11.2],
        backgroundColor: [
          greenPalette[3],
          greenPalette[2],
          greenPalette[1],
          greenPalette[0],
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    radius: "78%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
        },
      },
    },
  };

  const legendItems = [
    { label: "Spam Reports", value: "52.1%", color: greenPalette[3] },
    { label: "Flagged Contents", value: "22.8%", color: greenPalette[2] },
    { label: "Policy Violation", value: "13.9%", color: greenPalette[1] },
    { label: "Other", value: "11.2%", color: greenPalette[0] },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center w-full h-full gap-2 sm:gap-3 p-2">
      {/* Chart */}
      <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-28 lg:h-28">
        <Doughnut data={data} options={options} />
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1 sm:gap-1.5 text-[10px] sm:text-xs md:text-sm w-full max-w-[120px] sm:max-w-[140px] md:max-w-[160px]">
        {legendItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 sm:gap-2 text-gray-700 truncate"
          >
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="truncate">{item.label}</span>
            <span className="ml-auto font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChartCompAdmin;
