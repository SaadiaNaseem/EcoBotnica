import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ Fetch All Orders
  const fetchAllOrders = async () => {
    if (!token) return
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Update Order Status
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: newStatus },
        { headers: { token } }
      )

      if (response.data.success) {
        // ✅ Update UI instantly
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  payment: newStatus === 'Delivered' ? true : order.payment,
                }
              : order
          )
        )

        // ✅ Friendly success message
        if (newStatus === 'Delivered') {
          toast.success('Order marked as Delivered & Payment Received')
        } else {
          toast.success('Order status updated successfully')
        }

        // ✅ Refresh from backend to sync stats
        await fetchAllOrders()
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading Orders...</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Order Management
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {orders.map((order) => {
          const paymentStatus =
            order.status === 'Delivered' || order.payment ? 'Done' : 'Pending'

          return (
            <motion.div
              key={order._id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto_auto_auto] gap-6 items-start">
                {/* Column 1: Image */}
                <div className="flex justify-center">
                  <img
                    className="w-16 h-16 object-contain"
                    src={assets.parcel_icon}
                    alt="Order"
                  />
                </div>

                {/* Column 2: Items, Customer Name, Address */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-gray-700">
                        {item.name} x {item.quantity}{' '}
                        {item.size && (
                          <span className="text-gray-500">({item.size})</span>
                        )}
                      </p>
                    ))}
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold text-gray-800">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>{order.address.street},</p>
                      <p>
                        {order.address.city}, {order.address.state},{' '}
                        {order.address.country}, {order.address.zipcode}
                      </p>
                      <p className="mt-1">📞 {order.address.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Column 3: Summary Info */}
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Items:</span>{' '}
                    {order.items.length}
                  </p>
                  <p>
                    <span className="font-semibold">Method:</span>{' '}
                    {order.paymentMethod}
                  </p>
                  <p>
                    <span className="font-semibold">Payment:</span>
                    <span
                      className={
                        paymentStatus === 'Done'
                          ? 'text-green-600 ml-1'
                          : 'text-yellow-600 ml-1'
                      }
                    >
                      {paymentStatus}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Column 4: Total Amount */}
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">
                    {order.currency || 'PKR'} {order.amount}
                  </p>
                </div>

                {/* Column 5: Status Dropdown */}
                <div>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium bg-white"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )
        })}

        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <p className="text-gray-500 text-lg">No orders found</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Orders
