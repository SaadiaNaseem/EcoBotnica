import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantCard from "../compononts/PlantCard";
import AnalyticsCard from "../compononts/AnalyticsCard";
import PerformanceChart from "../compononts/PerformanceChart";
import { assets } from "../assets/assets";
import Title from '../compononts/Title';
import { Plus } from 'lucide-react';
import api from "../api/axios";
import { getUserId } from "../utils/getUserId";

export default function UserDashboard() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [chartData, setChartData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = getUserId();

  const allPlants = [
    { name: "Fiddle-leaf fig", image: assets.plant1 },
    { name: "Aloe vera", image: assets.plant2 },
    { name: "Strelitzia nicolai", image: assets.plant3 },
    { name: "Ficus microcarpa", image: assets.plant4 },
    { name: "Bird of Paradise", image: assets.plant1 },
    { name: "Peace Lily", image: assets.plant2 },
    { name: "Snake Plant", image: assets.plant3 },
    { name: "Money Tree", image: assets.plant4 },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get(`/plantcare/dashboard/${userId}`);
        setChartData(res.data.chartData);
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchDashboard();
  }, [userId]);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="py-12">
      <div className="text-2xl mb-4">
        <Title text1="USER" text2="DASHBOARD" />
      </div>

      <div className="font-sans text-gray-900">
        {/* --- Plants Section --- */}
        <section className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-serif">Your Plants</h1>
            <button
              className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition"
              onClick={() => navigate('/addnewplantprofile')}
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allPlants.slice(0, visibleCount).map((p, i) => (
              <PlantCard key={i} name={p.name} image={p.image} />
            ))}
          </div>

          <div className="text-center mt-6">
            {visibleCount < allPlants.length ? (
              <button onClick={() => setVisibleCount((c) => c + 4)} className="bg-black text-white px-6 py-2 rounded-full text-sm">
                See More
              </button>
            ) : (
              <button onClick={() => setVisibleCount(4)} className="bg-gray-200 text-black px-6 py-2 rounded-full text-sm">
                See Less
              </button>
            )}
          </div>
        </section>

        <hr className="my-6 border-black" />

        {/* --- Analytics Section --- */}
        <section className="p-6">
          <h2 className="text-3xl font-serif mb-6">Analytics</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <AnalyticsCard
              title="Water Tracking"
              time={analytics?.watering ? new Date(analytics.watering).toLocaleDateString() : "—"}
              color="#22d3ee"
            />
            <AnalyticsCard
              title="Pruning Tracking"
              time={analytics?.pruning ? new Date(analytics.pruning).toLocaleDateString() : "—"}
              color="#fde047"
            />
            <AnalyticsCard
              title="Fertilizer Tracking"
              time={analytics?.fertilizing ? new Date(analytics.fertilizing).toLocaleDateString() : "—"}
              color="#4ade80"
            />
          </div>
        </section>

        <hr className="my-6 border-black" />

        {/* --- Performance Chart --- */}
        <section className="p-6">
          <h2 className="text-3xl font-serif mb-6">Performance throughout the year</h2>
          <div className="bg-white p-4 shadow rounded-lg">
            <PerformanceChart chartData={chartData} />
          </div>
        </section>
      </div>
    </div>
  );
}
