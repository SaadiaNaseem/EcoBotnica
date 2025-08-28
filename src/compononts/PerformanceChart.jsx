// File: /components/PerformanceChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Get current month index (0 = Jan, 7 = Aug if current is August)
const currentMonthIndex = new Date().getMonth();

const fullData = [
  { month: "JAN", Watering: 40, Pruning: 24, Fertilizing: 30 },
  { month: "FEB", Watering: 35, Pruning: 20, Fertilizing: 28 },
  { month: "MAR", Watering: 30, Pruning: 13, Fertilizing: 22 },
  { month: "APR", Watering: 20, Pruning: 98, Fertilizing: 20 },
  { month: "MAY", Watering: 27, Pruning: 39, Fertilizing: 25 },
  { month: "JUN", Watering: 50, Pruning: 30, Fertilizing: 40 },
  { month: "JUL", Watering: 30, Pruning: 70, Fertilizing: 50 },
  { month: "AUG", Watering: 60, Pruning: 40, Fertilizing: 20 },
  { month: "SEP", Watering: 20, Pruning: 50, Fertilizing: 30 },
  { month: "OCT", Watering: 45, Pruning: 35, Fertilizing: 45 },
  { month: "NOV", Watering: 33, Pruning: 28, Fertilizing: 37 },
  { month: "DEC", Watering: 55, Pruning: 60, Fertilizing: 42 },
];

// Only keep data from Jan to current month
const data = fullData.slice(0, currentMonthIndex + 1);

export default function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis label={{ value: "# Tasks", angle: -90, position: "insideLeft" }} />
        <Tooltip
          formatter={(value, name) => [`${value} tasks`, name]}
          labelStyle={{ fontWeight: "bold" }}
        />
        <Line
          type="monotone"
          dataKey="Watering"
          stroke="#3b82f6"
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Pruning"
          stroke="#facc15"
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Fertilizing"
          stroke="#22c55e"
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}