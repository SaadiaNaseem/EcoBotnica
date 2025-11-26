// src/components/ComplaintsBarChartAdmin.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartCompAdmin = () => {
  // Generate months from Jan to current
  const months = [];
  const now = new Date();
  for (let m = 0; m <= now.getMonth(); m++) {
    months.push(new Date(now.getFullYear(), m).toLocaleString("default", { month: "short" }));
  }

  // Static sample data (replace with DB connection later)
  const data = {
    labels: months,
    datasets: [
      {
        label: "Registered Complaints",
        data: [50, 40, 60, 45, 70, 65, 80, 55, 72, 68, 0, 0].slice(0, months.length),
        backgroundColor: "#059669",
        borderRadius: 6,
        barThickness: "flex", // auto-adjust bars
      },
      {
        label: "Resolved Complaints",
        data: [30, 35, 50, 40, 65, 60, 75, 50, 60, 64, 0, 0].slice(0, months.length),
        backgroundColor: "#064e3b",
        borderRadius: 6,
        barThickness: "flex", // auto-adjust bars
      },
    ],
  };

  // Custom legend (circles instead of squares)
  const CustomLegend = () => {
    return (
      <div className="flex flex-wrap gap-3 mt-3 justify-center text-xs sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#059669" }}></span>
          <span className="text-green-900 font-medium">Registered Complaints</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#064e3b" }}></span>
          <span className="text-green-900 font-medium">Resolved Complaints</span>
        </div>
      </div>
    );
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#166534",
          font: { weight: "500", size: 10 },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: "#166534",
          font: { weight: "500", size: 10 },
        },
        grid: { color: "rgba(22, 101, 52, 0.1)" },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="bg-green-50 p-3 sm:p-4 rounded-xl shadow w-full h-64 sm:h-80 md:h-96 flex flex-col">
      <div className="flex-1">
        <Bar data={data} options={options} />
      </div>
      <CustomLegend />
    </div>
  );
};

export default BarChartCompAdmin;
