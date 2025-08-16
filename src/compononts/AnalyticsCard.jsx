// File: /components/AnalyticsCard.jsx
import { PieChart, Pie, Cell } from "recharts";

export default function AnalyticsCard({ title, time, color }) {
  const data = [
    { name: "Completed", value: 75 },
    { name: "Remaining", value: 25 },
  ];
  return (
    <div className="w-full sm:w-64 bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center space-y-4 transition hover:shadow-lg">
      <div className="w-full text-center">
        <h3 className="font-semibold text-base">{title || "Task"}</h3>
        <p className="text-xs text-gray-500 mt-1">
          Next {title?.split(" ")[0] || "Task"} Schedule
        </p>
      </div>

      <div className="relative">
        <PieChart width={150} height={150}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            <Cell key="value1" fill={color || "#22d3ee"} />
            <Cell key="value2" fill="#e5e7eb" />
          </Pie>
        </PieChart>

        {/* Centered Time Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-gray-800">
          {time || "N/A"}
        </div>
      </div>
    </div>
  );
}