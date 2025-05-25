import React, { useContext, useState } from 'react'
import Title from '../compononts/Title'
import CartTotal from '../compononts/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from "react-toastify";

const PlaceOrder = () => {
  //state variable to select Payment method By default cash on delivery is selected
  const [method, setMethod] = useState('cod');
  const { userId, navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []

      for (const productId in cartItems) {
        const quantity = cartItems[productId];
        if (quantity > 0) {
          // Find product info by id
          const itemInfo = structuredClone(products.find(product => product._id === productId));
          if (itemInfo) {
            itemInfo.quantity = quantity;
            orderItems.push(itemInfo);
          }
        }
      }

      let orderData = {
        userId,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {

        //api calls for COD

        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if(response.data.success){
            setCartItems({})
            navigate('/orders')
          }else{
            toast.error(response.data.message)
          }
          break;
        default:
          break;
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className=' flex flex-col sm:flex-row justify-between gap-4 pt-2 sm:pt-6 min-h-[80vh] border-t'>
      {/* here is the left wali side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='Last Name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="email" placeholder='Email Address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="number" placeholder='Zip code' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="number" placeholder='Phone' />
      </div>
      {/* Rige side of this page starts here*/}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment method selection here */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-emerald-800' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.Stripe} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3 h-3.5 border rounded-full ${method === 'cod' ? 'bg-emerald-800' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm rounded-[20px]'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
