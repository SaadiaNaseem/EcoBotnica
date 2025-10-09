import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Plants")
  const [subCategory, setSubCategory] = useState("Indoor")
  const [bestseller, setBestseller] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        // Reset form
        setName("")
        setDescription("")
        setImage1(null)
        setImage2(null)
        setImage3(null)
        setImage4(null)
        setPrice("")
        setCategory("Plants")
        setSubCategory("Indoor")
        setBestseller(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error submitting product:", error.response?.data || error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Add New Product
      </motion.h1>

      <motion.form 
        onSubmit={onSubmitHandler} 
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-md p-6 space-y-6"
      >
        {/* Image Upload Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Product Images</h3>
          <div className="flex gap-4 flex-wrap">
            {[1, 2, 3, 4].map((num) => {
              const imageState = [image1, image2, image3, image4][num - 1]
              const setImageState = [setImage1, setImage2, setImage3, setImage4][num - 1]
              
              return (
                <label key={num} htmlFor={`image${num}`} className="cursor-pointer">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-green-500 transition-colors duration-200">
                    <img 
                      className="w-full h-full object-cover rounded-lg" 
                      src={!imageState ? assets.upload_area : URL.createObjectURL(imageState)} 
                      alt={`Upload ${num}`} 
                    />
                  </div>
                  <input 
                    onChange={(e) => setImageState(e.target.files[0])} 
                    type="file" 
                    id={`image${num}`} 
                    name={`image${num}`} 
                    hidden 
                  />
                </label>
              )
            })}
          </div>
        </motion.div>

        {/* Product Name */}
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            type="text"
            placeholder="Enter product name"
            required
          />
        </motion.div>

        {/* Product Description */}
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Product Description</label>
          <textarea
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Write product description here..."
            rows="4"
            required
          />
        </motion.div>

        {/* Category, Subcategory, and Price */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Category</label>
            <select
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Seeds">Seeds</option>
              <option value="Fertilizers">Fertilizers</option>
              <option value="Plants">Plants</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sub Category</label>
            <select
              name="subCategory"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Price (PKR)</label>
            <input
              name="price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              type="number"
              placeholder="Enter price"
              required
            />
          </div>
        </motion.div>

        {/* Bestseller Checkbox */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <input
            name="bestseller"
            onChange={() => setBestseller(prev => !prev)}
            checked={bestseller}
            type="checkbox"
            id='bestseller'
            className="w-5 h-5 text-green-600 focus:ring-green-500 rounded"
          />
          <label className="text-gray-700 font-medium cursor-pointer" htmlFor="bestseller">
            Add to bestseller collection
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.button 
          variants={itemVariants}
          type='submit' 
          disabled={loading}
          className={`w-32 py-3 rounded-lg font-semibold transition-all duration-200 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
          }`}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </motion.button>
      </motion.form>
    </div>
  )
}

export default Add