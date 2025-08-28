import React from "react";
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const EAdashPieChart = ({ title, labels, dataValues }) => {
  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: ["#22c55e", "#86efac", "#bbf7d0", "#fcd34d"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true, // Makes legend icons circular
          pointStyle: "circle",
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-4"
    >
      <h3 className="font-semibold mb-3 text-gray-800">{title}</h3>
      <div style={{ width: "180px", height: "180px", margin: "0 auto" }}>
        <Doughnut data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default EAdashPieChart;
