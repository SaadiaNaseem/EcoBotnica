import React from 'react';

const NewsLetterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
        // You can handle the email submission here
        console.log("Email submitted");
    }

  return (
    <div className='text-center'>
        <p className='text-xl font-medium text-grey-800'>Subscribe Now & get 20% discount on your First Order</p>
        <p className='text-grey-400 mt-3'>
            Don’t miss out on exclusive offers, tips, and updates straight to your inbox.
        </p>
        <form onSubmit={onSubmitHandler} className='flex justify-center items-center mt-4'>
            <input 
                className='w-full sm:w-80 md:w-96 outline-none border border-gray-800 rounded-l-lg px-4 py-2' 
                type="email" 
                placeholder='Please Enter Your Email' 
                required 
            />
            <button 
                type='submit' 
                className='bg-black text-white text-xs px-10 py-4 rounded-r-lg ml-2'
            >
                Subscribe
            </button>
        </form>
    </div>
  );
}

export default NewsLetterBox;
