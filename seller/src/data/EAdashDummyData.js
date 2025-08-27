// src/data/EAdashDummyData.js

// NOTE: Later this data will come from DB/API
export const statsData = [
  { title: "Total Order", value: "32000.00", icon: "lock" },
  { title: "Order Successful", value: "23000.00", icon: "users" },
  { title: "Total Balance", value: "$3,32000.00", icon: "dollar" },
  {
    title: "Add products in the store",
    value: "",
    icon: "add",
    link: "/add",
  },
];

export const orderDetails = [
  { text: "Black rose", time: "3d ago" },
  { text: "Purchase report", time: "4d ago" },
  { text: "New Product Add", time: "5d ago" },
  { text: "Product tag Add", time: "5d ago" },
  { text: "Product Variable & Price Set", time: "5d ago" },
];

export const reviews = [
  { label: "Excellent", value: 80 },
  { label: "Good", value: 60 },
  { label: "Average", value: 40 },
  { label: "Avg-below", value: 25 },
  { label: "Poor", value: 15 },
];

export const complaints = [
  { label: "Spam Reports", value: 52.1 },
  { label: "Flagged Contents", value: 22.8 },
  { label: "Policy Violation", value: 13.9 },
  { label: "Other", value: 11.2 },
];
