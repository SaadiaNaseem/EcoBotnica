import React, { useState, useEffect } from "react";
import EAdashStatCard from "../components/EAdashStatCard";
import EAdashLineChart from "../components/EAdashLineChart";
import EAdashPieChart from "../components/EAdashPieChart";
import EAdashOrderDetails from "../components/EAdashOrderDetails";
import EAdashManageOrders from "../components/EAdashManageOrders";
import { motion } from "framer-motion";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const EAdashSellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    salesData: { labels: [], datasets: [] },
    orderStatus: { labels: [], dataValues: [] },
    recentOrders: [],
    allOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently";
    const now = new Date();
    const orderDate = new Date(timestamp);
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`;
      }
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  const fetchDashboardData = async () => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (!response.data.success)
        throw new Error(response.data.message || "Failed to fetch orders");

      const orders = response.data.orders || [];
      const totalOrders = orders.length;

      // ✅ Successful orders = all Delivered orders (payment assumed done)
      const successfulOrdersArr = orders.filter(
        (order) => order.status === "Delivered"
      );
      const successfulOrders = successfulOrdersArr.length;

      // ✅ Total revenue = sum of all Delivered order amounts
      const totalRevenue = successfulOrdersArr.reduce(
        (sum, order) => sum + (order.amount || 0),
        0
      );

      // ✅ Count order statuses for pie chart
      const statusCount = {};
      orders.forEach((order) => {
        const status = order.status || "Unknown";
        statusCount[status] = (statusCount[status] || 0) + 1;
      });

      // ✅ Recent orders (this month)
      const now = new Date();
      const recentOrders = orders
        .filter((order) => {
          const orderDate = new Date(order.date);
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map((order) => ({
          id: order._id,
          text: `${order.items.length} items - PKR ${order.amount || 0}`,
          time: formatTimeAgo(order.date),
          customer: `${order.address?.firstName || ""} ${
            order.address?.lastName || ""
          }`.trim(),
        }));

      // ✅ Stat cards
      const stats = [
        { title: "Total Orders", value: totalOrders.toString(), icon: "lock" },
        {
          title: "Successful Orders",
          value: successfulOrders.toString(),
          icon: "users",
        },
        {
          title: "Total Revenue",
          value: `PKR ${totalRevenue.toLocaleString()}`,
          icon: "dollar",
        },
        {
          title: "Add products in the store",
          value: "",
          icon: "add",
          link: "/add",
        },
      ];

      // ✅ Pie chart (Order status)
      const orderStatus = {
        labels: Object.keys(statusCount),
        dataValues: Object.values(statusCount),
      };

      // ✅ Line chart: Total vs Delivered orders by month
      const monthLabels = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(i);
        return date.toLocaleString("en-US", { month: "short" });
      });

      const monthlyTotalOrders = [];
      const monthlyDeliveredOrders = [];

      for (let i = 0; i < 12; i++) {
        const total = orders.filter((order) => {
          const d = new Date(order.date);
          return (
            d.getMonth() === i && d.getFullYear() === now.getFullYear()
          );
        }).length;

        const delivered = orders.filter((order) => {
          const d = new Date(order.date);
          return (
            d.getMonth() === i &&
            d.getFullYear() === now.getFullYear() &&
            order.status === "Delivered"
          );
        }).length;

        monthlyTotalOrders.push(total);
        monthlyDeliveredOrders.push(delivered);
      }

      const salesData = {
        labels: monthLabels,
        datasets: [
          {
            label: "Total Orders",
            data: monthlyTotalOrders,
            borderColor: "blue",
          },
          {
            label: "Delivered Orders",
            data: monthlyDeliveredOrders,
            borderColor: "green",
          },
        ],
      };

      // ✅ Update state
      setDashboardData({
        stats,
        salesData,
        orderStatus,
        recentOrders,
        allOrders: orders.map((order) => ({
          id: order._id,
          items: order.items,
          amount: order.amount,
          customer: `${order.address?.firstName || ""} ${
            order.address?.lastName || ""
          }`.trim(),
          paymentMethod: order.paymentMethod,
          status: order.status,
          payment: order.payment,
        })),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const handleUpdateStatus = async (orderId, update) => {
    try {
      await axios.post(
        backendUrl + "/api/order/status",
        { orderId, ...update },
        { headers: { token } }
      );

      // ✅ Update message based on status
      if (update.status === "Delivered") {
        toast.success("Order marked as Delivered & Payment Received");
      } else {
        toast.success("Order status updated successfully");
      }

      // ✅ Refresh dashboard after status update
      await fetchDashboardData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        Loading Dashboard...
      </div>
    );

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

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <strong>Note:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {dashboardData.stats.map((stat, idx) => (
          <EAdashStatCard key={idx} {...stat} delay={idx * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <EAdashLineChart
          labels={dashboardData.salesData.labels}
          datasets={dashboardData.salesData.datasets}
        />
        <EAdashPieChart
          title="Order Status"
          labels={dashboardData.orderStatus.labels}
          dataValues={dashboardData.orderStatus.dataValues}
        />
        <EAdashOrderDetails orders={dashboardData.recentOrders} />
      </div>

      <div className="mt-8">
        <EAdashManageOrders
          orders={dashboardData.allOrders}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
};

export default EAdashSellerDashboard;
