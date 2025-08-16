import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantCard from "../compononts/PlantCard";
import AnalyticsCard from "../compononts/AnalyticsCard";
import PerformanceChart from "../compononts/PerformanceChart";
import { assets } from "../assets/assets";
import Title from '../compononts/Title';
import { Plus } from 'lucide-react';

const allPlants = [
  { name: "Fiddle-leaf fig", image: assets.plant1 },
  { name: "Aloe vera", image: assets.plant2 },
  { name: "Strelitzia nicolai", image: assets.plant3 },
  { name: "Ficus microcarpa", image: assets.plant4 },
  { name: "Bird of Paradise", image: assets.plant1 },  // new plant
  { name: "Peace Lily", image: assets.plant2 },
  { name: "Snake Plant", image: assets.plant3 },
  { name: "Money Tree", image: assets.plant4 },
  { name: "Bamboo Palm", image: assets.plant1 },
  { name: "Spider Plant", image: assets.plant2 },
];

export default function UserDashboard() {
  const initialDisplayCount = 4;
  const batchSize = 4;

  const [visibleCount, setVisibleCount] = useState(initialDisplayCount);

  const handleSeeMore = () => {
    const nextCount = visibleCount + batchSize;
    setVisibleCount(Math.min(nextCount, allPlants.length));
  };

  const handleSeeLess = () => {
    setVisibleCount(initialDisplayCount);
  };

  const visiblePlants = allPlants.slice(0, visibleCount);
  const navigate = useNavigate();

  return (
    <div className="py-12">
      {/* Title */}
      <div className="text-2xl mb-4">
        <Title text1="USER" text2="DASHBOARD" />
      </div>

      <div className="font-sans text-gray-900">
        {/* Your Plants */}
        <section className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-serif">Your Plants</h1>
            <button className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition"
            onClick={() => navigate('/addnewplantprofile')}>
              <Plus size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {visiblePlants.map((plant, index) => (
              <PlantCard key={index} name={plant.name} image={plant.image} />
            ))}
          </div>

          <div className="text-center mt-6">
            {visibleCount < allPlants.length ? (
              <button
                onClick={handleSeeMore}
                className="bg-black text-white px-6 py-2 rounded-full text-sm"
              >
                See More
              </button>
            ) : (
              allPlants.length > initialDisplayCount && (
                <button
                  onClick={handleSeeLess}
                  className="bg-gray-200 text-black px-6 py-2 rounded-full text-sm"
                >
                  See Less
                </button>
              )
            )}
          </div>
        </section>

        <hr className="my-6 border-black" />

        {/* Analytics */}
        <section className="p-6">
          <h2 className="text-3xl font-serif mb-6">Analytics</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <AnalyticsCard title="Water Tracking" time="In 3 hours" color="#22d3ee" />
            <AnalyticsCard title="Pruning Tracking" time="In 3 days" color="#fde047" />
            <AnalyticsCard title="Fertilizer Tracking" time="In 3 days" color="#4ade80" />
          </div>
        </section>

        <hr className="my-6 border-black" />

        {/* Performance Chart */}
        <section className="p-6">
          <h2 className="text-3xl font-serif mb-6">Performance throughout the year</h2>
          <div className="bg-white p-4 shadow rounded-lg">
            <PerformanceChart />
          </div>
        </section>
      </div>
    </div>
  );
}