import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PerformanceChart({ chartData = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis label={{ value: "# Tasks", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Line type="monotone" dataKey="Watering" stroke="#3b82f6" dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Pruning" stroke="#facc15" dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Fertilizing" stroke="#22c55e" dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
