import React, { useContext, useState } from 'react'
import Title from '../compononts/Title'
import CartTotal from '../compononts/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const PlaceOrder = () => {
  //state variable to select Payment metho d By default cash on delivery is selected
  const [method, setMethod] = useState('cod');
  const {navigate} = useContext(ShopContext);

  return (
    <div className=' flex flex-col sm:flex-row justify-between gap-4 pt-2 sm:pt-6 min-h-[80vh] border-t'>
      {/* here is the left wali side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='First Name' />
          <input className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='Last Name' />
        </div>
        <input className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="email" placeholder='Email Address' />
        <input className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='City' />
          <input className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="number" placeholder='Zip code' />
          <input className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="text" placeholder='Country' />
        </div>
        <input className='border border-grey-300 rounded py-1.5 px-3.3 w-full' type="number" placeholder='Phone' />
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
            <button onClick={()=> navigate('/orders')} className='bg-black text-white px-16 py-3 text-sm rounded-[20px]'>PLACE ORDER</button>

          </div>
        </div>

      </div>
    </div>
  )
}

export default PlaceOrder
