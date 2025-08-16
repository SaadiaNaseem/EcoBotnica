import React from "react";
import EAdashStatCard from "../components/EAdashStatCard";
import EAdashLineChart from "../components/EAdashLineChart";
import EAdashPieChart from "../components/EAdashPieChart";
import EAdashOrderDetails from "../components/EAdashOrderDetails";
import EAdashCustomerReview from "../components/EAdashCustomerReview";
import { motion } from "framer-motion";
import { statsData, complaints } from "../data/EAdashDummyData";

const EAdashSellerDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Seller Dashboard
      </motion.h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, idx) => (
          <EAdashStatCard key={idx} {...stat} delay={idx * 0.1} />
        ))}
      </div>

      {/* Charts + Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <EAdashLineChart />
        <EAdashPieChart
          title="Order Status"
          labels={["Success", "Pending", "Failed"]}
          dataValues={[65, 20, 15]}
        />
        <EAdashOrderDetails />
      </div>

      {/* Customer Review + Complaints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EAdashCustomerReview />
        <EAdashPieChart
          title="Customer Complaints"
          labels={complaints.map((c) => c.label)}
          dataValues={complaints.map((c) => c.value)}
        />
      </div>
    </div>
  );
};

export default EAdashSellerDashboard;
