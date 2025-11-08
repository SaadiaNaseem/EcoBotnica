import React from "react";
import { useNavigate } from "react-router-dom";

const EAdashManageOrders = ({ orders, onUpdateStatus }) => {
  const navigate = useNavigate();

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
        No orders found
      </div>
    );
  }

  // ✅ Show only the first 5 orders
  const visibleOrders = orders.slice(0, 5);

  const handleChange = (e, order) => {
    const newStatus = e.target.value;
    onUpdateStatus(order.id, { status: newStatus });
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Orders</h2>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Customer</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Items</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Payment Method</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Payment Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {visibleOrders.map((order) => {
            const paymentStatus =
              order.status === "Delivered" || order.payment
                ? "Received"
                : "Pending";

            return (
              <tr key={order.id}>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {order.id.slice(0, 8)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{order.customer}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name} x {item.quantity}{" "}
                      {item.size && `(${item.size})`}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{order.paymentMethod}</td>
                <td
                  className={`px-4 py-2 text-sm font-medium ${
                    paymentStatus === "Received"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {paymentStatus}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{order.amount}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <select
                    value={order.status}
                    onChange={(e) => handleChange(e, order)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium bg-white"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ✅ See More Button */}
      {orders.length > 5 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow transition-all duration-200"
          >
            See More Orders →
          </button>
        </div>
      )}
    </div>
  );
};

export default EAdashManageOrders;
