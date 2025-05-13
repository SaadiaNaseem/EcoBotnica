import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../compononts/Title';
import { Trash } from "lucide-react";
import CartTotal from '../compononts/CartTotal';

const Cart = () => {
  const { products, currency, cartItems , updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    // Iterate through cartItems object and convert it to an array
    for (const itemId in cartItems) {
      if (cartItems.hasOwnProperty(itemId) && cartItems[itemId] > 0) {
        tempData.push({
          _id: itemId,
          //age: item.age,
          quantity: cartItems[itemId],
        });
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className='border-t pt-8'>
      <div className='text-2xl mb-3'>
        <Title text1={'Your'} text2={'CART'} />
      </div>
      <div>
        {cartData.length === 0 ? (
          <p>No products in the cart</p>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            // Check if productData is found
            if (!productData) {
              console.error(`Product with ID ${item._id} not found`);
              return null; // Skip rendering if productData is not found
            }

            return (
              <div
                key={index}
                className='py-4 border-b border-t text-grey-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
              >
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20 h-16 sm:h-20 ' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className=' flex items-center gap-5 mt-2'>
                        <p>{currency}{productData.price}</p>
                        {/* <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.age}</p> */}
                    </div>
                  </div>
                </div>
                <input onChange={(e)=> e.target.value === ''|| e.target.value === '0'? null : updateQuantity(item._id, Number(e.target.value)) } className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 bg-slate-50' type = "number" min= {1} defaultValue={item.quantity}/>
                <Trash  onClick = {()=>updateQuantity(item._id, 0)}className="w-4 mr-4 cursor-pointer" />
              </div>
            );
          })
        )}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal/>
          <div className='w-full text-end'>
              <button onClick={()=> navigate ('/placeOrder')} className=' bg-black text-white text-sm my-8 px-8 py-3 rounded-[20px]'> PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div> 

    </div>
  );
};

export default Cart;
