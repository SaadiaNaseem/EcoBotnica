import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const EAdashLineChart = ({ labels = [], datasets = [] }) => {
  const data = {
    labels,
    datasets: datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      fill: false,
      borderColor: ds.borderColor,
      tension: 0.3,
      pointBackgroundColor: ds.borderColor,
      pointBorderColor: ds.borderColor,
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: true,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,   // ✅ Makes legend markers circular
          pointStyle: "circle",  // ✅ Circle shape instead of rectangle
          boxWidth: 10,          // size of circle
          boxHeight: 10,
          padding: 15,
          color: "#333",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-semibold text-gray-800 mb-4 text-center text-lg">
        Order Ratio Throughout The Year
      </h3>

      <Line data={data} options={options} />
    </div>
  );
};

export default EAdashLineChart;
