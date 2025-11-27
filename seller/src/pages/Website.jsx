import React from "react";
import OverviewCard from "../components/OverviewCardAdmin";
import LineChartComp from "../components/LineChartCompAdmin";
import DonutChartComp from "../components/DonutChartCompAdmin";
import BarChartComp from "../components/BarChartCompAdmin";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    // Hook for programmatic navigation
    const navigate = useNavigate();

        const stats = {
        newUsers: { value: 15, change: 5.03 },
        activeUsers: { value: 2, change: 3.08 }
    };

    const complaintsLine = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        thisYear: [10000, 8500, 15000, 25000, 22000, 18000, 21000],
        lastYear: [12000, 11000, 9000, 13000, 14000, 20000, 26000]
    };

    const donutData = [
        { label: "Spam Reports", value: 52.1 },
        { label: "Flagged Contents", value: 22.8 },
        { label: "Policy Violation", value: 13.9 },
        { label: "Other", value: 11.2 }
    ];

    const monthlyBars = {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        values: [18, 30, 22, 31, 12, 25, 15, 28, 20, 33, 11, 26]
    };

    return (
        <div className="py-12 min-h-screen p-6 relative overflow-hidden">
            {/* Dashboard Title */}
            <div className="text-2xl mb-4">
                <Title text1="ADMIN" text2="DASHBOARD" />
            </div>

            {/* ===== Top Stats Cards ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <OverviewCard title="New Users" data={stats.newUsers} />
                <OverviewCard title="Active Users" data={stats.activeUsers} />
            </div>

            {/* ===== Middle Section (Charts Row) ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                
                {/* Line Chart for No of Complaints */}
                <div className="lg:col-span-2 bg-green-50 p-4 rounded-xl shadow overflow-hidden">
                    {/* Chart Title + Legend */}
                    <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                        <h3 className="font-semibold text-gray-800">No of Complaints</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-green-700">
                            <span className="w-3 h-3 rounded-full bg-green-900"></span> This year
                            <span className="w-3 h-3 rounded-full bg-green-300"></span> Last year
                        </div>
                    </div>
                    <div className="w-full h-80">
                        <LineChartComp data={complaintsLine} />
                    </div>
                </div>

                {/* Donut Chart for Community Complaints */}
                <div className="bg-green-50 p-4 rounded-xl shadow flex flex-col justify-between">
                    {/* Title + See All Button */}
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">Community Complaints</h3>
                        <button
                            onClick={() => navigate('/communityComplaints')}
                            className="bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition"
                        >
                            See All
                        </button>
                    </div>

                    {/* Chart */}
                    <div className="w-full h-72 overflow-hidden">
                        <DonutChartComp data={donutData} />
                    </div>
                </div>
            </div>

            {/* ===== Bottom Section (Bar Chart) ===== */}
            {/* <div className="bg-green-50 p-4 rounded-xl shadow">
                <h3 className="font-semibold text-gray-800 mb-2">
                    Monthly Complaints: Registered vs Resolved
                </h3>
                <div className="w-full h-96 overflow-hidden">
                    <BarChartComp data={monthlyBars} />
                </div>
            </div> */}
        </div>
    );
};

export default AdminDashboard;
