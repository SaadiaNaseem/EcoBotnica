import React, { useState, useEffect } from "react";
import EAdashStatCard from "../components/EAdashStatCard";
import EAdashLineChart from "../components/EAdashLineChart";
import EAdashPieChart from "../components/EAdashPieChart";
import EAdashOrderDetails from "../components/EAdashOrderDetails";
import EAdashCustomerReview from "../components/EAdashCustomerReview";
import { motion } from "framer-motion";
import { statsData, orderDetails } from "../data/EAdashDummyData";
import axios from 'axios';
import { backendUrl } from '../App'; // Import from your App file
import { toast } from 'react-toastify';

const EAdashSellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    salesData: { labels: [], data: [] },
    orderStatus: { labels: [], dataValues: [] },
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage (same as your Orders component)
  const token = localStorage.getItem('token');

  // Fetch all data from backend using axios (same pattern as Orders)
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        
        // Fetch orders data using axios (same as your Orders component)
        const response = await axios.post(
          backendUrl + '/api/order/list', 
          {}, 
          { headers: { token } }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch orders');
        }

        const orders = response.data.orders || [];

        // Calculate stats from orders
        const totalOrders = orders.length;
        const successfulOrders = orders.filter(order => 
          order.status === 'Delivered' || order.payment === true
        ).length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const pendingOrders = orders.filter(order => 
          order.status === 'Pending' || order.status === 'Order Placed'
        ).length;

        // Prepare stats data - Using PKR instead of $
        const stats = [
          { title: "Total Orders", value: totalOrders.toString(), icon: "lock" },
          { title: "Successful Orders", value: successfulOrders.toString(), icon: "users" },
          { title: "Total Revenue", value: `PKR ${totalRevenue.toLocaleString()}`, icon: "dollar" },
          {
            title: "Add products in the store",
            value: "",
            icon: "add",
            link: "/add",
          }
        ];

        // Prepare sales chart data (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const salesChartData = last7Days.map((dateLabel, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - index));
          const dateString = date.toISOString().split('T')[0];
          
          const dayOrders = orders.filter(order => {
            if (!order.date) return false;
            const orderDate = new Date(order.date).toISOString().split('T')[0];
            return orderDate === dateString;
          });
          
          return dayOrders.length;
        });

        const salesData = {
          labels: last7Days,
          data: salesChartData
        };

        // Prepare order status data
        const statusCount = {};
        orders.forEach(order => {
          const status = order.status || 'Unknown';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });

        const orderStatus = {
          labels: Object.keys(statusCount),
          dataValues: Object.values(statusCount)
        };

        // Prepare recent orders (using PKR)
        const recentOrders = orders
          .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
          .slice(0, 5)
          .map(order => ({
            id: order._id,
            text: `${order.items.length} items - PKR ${order.amount || 0}`,
            time: formatTimeAgo(order.date),
            customer: `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.trim()
          }));

        setDashboardData({
          stats,
          salesData,
          orderStatus,
          recentOrders
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
        toast.error('Failed to load dashboard data');
        
        // Fallback to dummy data if API fails - Using PKR
        setDashboardData({
          stats: [
            { title: "Total Order", value: "32000", icon: "lock" },
            { title: "Order Successful", value: "23000", icon: "users" },
            { title: "Total Balance", value: "PKR 3,32,000", icon: "dollar" },
            {
              title: "Add products in the store",
              value: "",
              icon: "add",
              link: "/add",
            }
          ],
          salesData: { labels: ["05 Dec", "10 Dec", "15 Dec", "20 Dec", "25 Dec"], data: [50, 120, 90, 150, 130] },
          orderStatus: { labels: ["Order Placed", "Packing", "Shipped", "Delivered"], dataValues: [30, 20, 15, 35] },
          recentOrders: orderDetails.map(order => ({
            ...order,
            text: order.text.replace('$', 'PKR ')
          }))
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const orderDate = new Date(timestamp);
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays > 1) return `${diffDays} days ago`;
    
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours === 1) return '1 hour ago';
    if (diffHours > 1) return `${diffHours} hours ago`;
    
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    return `${diffMinutes} minutes ago`;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6"
        >
          <strong>Note:</strong> {error}
        </motion.div>
      )}

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {dashboardData.stats.map((stat, idx) => (
          <EAdashStatCard key={idx} {...stat} delay={idx * 0.1} />
        ))}
      </div>

      {/* Charts + Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <EAdashLineChart salesData={dashboardData.salesData} />
        <EAdashPieChart
          title="Order Status"
          labels={dashboardData.orderStatus.labels}
          dataValues={dashboardData.orderStatus.dataValues}
        />
        <EAdashOrderDetails orders={dashboardData.recentOrders} />
      </div>

      {/* Customer Review + Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EAdashCustomerReview />
        <EAdashPieChart
          title="Order Status Overview"
          labels={dashboardData.orderStatus.labels}
          dataValues={dashboardData.orderStatus.dataValues}
        />
      </div>
    </div>
  );
};

export default EAdashSellerDashboard;