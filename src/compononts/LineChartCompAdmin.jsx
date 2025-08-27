import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const LineChartCompAdmin = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "This year",
        data: data.thisYear,
        fill: true,
        backgroundColor: "rgba(16, 80, 50, 0.15)",
        borderColor: "rgba(16, 80, 50, 1)",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: "Last year",
        data: data.lastYear,
        borderDash: [6, 6],
        borderColor: "rgba(120, 180, 140, 0.9)",
        tension: 0.3,
        pointRadius: 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { display: false } },
    animation: { duration: 1000, easing: "easeOutQuart" },
    scales: { y: { beginAtZero: true } }
  };

  return <div className="h-64"><Line data={chartData} options={options} /></div>;
};

export default LineChartCompAdmin;
