import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../compononts/Title';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    // console.log('Token sent:', token);

    try {
      if (!token) {
        null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })

      let allOrdersItem = [];

      if (response.data.success) {
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }


    } catch (error) {

    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-8'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>
      <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20 h-16 sm:h-20' src={item.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-2'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>

                </div>
              </div>
              <div className='md:w-1/2 flex items-center justify-between gap-4'>
                <div className='flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full bg-emerald-800'></span>

                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button onClick={loadOrderData} className='border border-gray-300 px-2.5 py-0.5 text-sm font-normal rounded-sm hover:bg-gray-50 transition-colors leading-tight'>
                  Track Order
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Orders