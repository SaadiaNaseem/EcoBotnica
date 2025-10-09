import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading Products...</div>
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
        Product Management
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Products List</h2>

        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center px-6 py-4 bg-gray-50 rounded-lg text-gray-700 font-semibold mb-4'>
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className='text-center'>Action</span>
        </div>

        {/* Product List */}
        <div className="space-y-3">
          {list.map((item, index) => (
            <motion.div
              key={item._id}
              variants={itemVariants}
              className='grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-4 px-6 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow duration-200'
            >
              <img className='w-16 h-16 object-cover rounded-lg' src={item.image[0]} alt={item.name} />
              <p className="text-gray-800 font-medium">{item.name}</p>
              <p className="text-gray-600">{item.category}</p>
              <p className="text-gray-800 font-semibold">{currency}{item.price}</p>
              <div className="flex justify-center">
                <button
                  onClick={() => removeProduct(item._id)}
                  className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 font-bold text-lg"
                >
                  ×
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {list.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            No products found
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default List