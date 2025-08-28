import React from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const EAdashLineChart = () => {
  const data = {
    labels: ["05 Dec", "10 Dec", "15 Dec", "20 Dec", "25 Dec"],
    datasets: [
      {
        label: "Orders",
        data: [50, 120, 90, 150, 130],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: "circle", // makes it circular
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-4"
    >
      <h3 className="font-semibold mb-3 text-gray-800">Order In This Month</h3>
      <Line data={data} options={options} />
    </motion.div>
  );
};

export default EAdashLineChart;
