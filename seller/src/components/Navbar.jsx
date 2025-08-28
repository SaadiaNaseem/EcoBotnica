import React from 'react';
import { assets } from "../assets/assets.js";

const Navbar = ({ setToken }) => {

  const handleMainNavClick = () => {
    window.location.href = 'http://localhost:5173/Ecom'; // External redirect
  };

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <div onClick={handleMainNavClick} className="cursor-pointer">
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="Logo" />
      </div>

      <h3 className="text-4xl font-bold">
        Seller Dashboard
      </h3>

      <button
        onClick={() => setToken('')}
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
