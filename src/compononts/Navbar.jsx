import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [isEcom, setIsEcom] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleMainNavClick = () => {
    setIsEcom(false); // Switch back to main navigation
    setVisible(false);
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      {/* Logo */}
      <img src={assets.logoResized} className="w-5 h-5" alt="Logo" />

      {/* Desktop Navigation */}
      <ul className="hidden sm:flex gap-5 text-sm text-black">
        {!isEcom ? (
          <>
            <NavLink to="/" className="flex flex-col items-center gap-1" onClick={handleMainNavClick}>
              <p>Plant Identification</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/plantDoctor" className="flex flex-col items-center gap-1" onClick={handleMainNavClick}>
              <p>Plant Doctor</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/companionPlanting" className="flex flex-col items-center gap-1" onClick={handleMainNavClick}>
              <p>Companion Planting</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/plantCare" className="flex flex-col items-center gap-1" onClick={handleMainNavClick}>
              <p>Plant Care</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/Ecom" className="flex flex-col items-center gap-1" onClick={() => setIsEcom(true)}>
              <p>E-com Store</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/plantationGuide" className="flex flex-col items-center gap-1" onClick={handleMainNavClick}>
              <p>Planting Guide</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" className="flex flex-col items-center gap-1" onClick={handleMainNavClick}>
              <p>Main</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/Ecom" className="flex flex-col items-center gap-1">
              <p>E-com</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/collection" className="flex flex-col items-center gap-1">
              <p>COLLECTION</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/contacts" className="flex flex-col items-center gap-1">
              <p>CONTACT-US</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
          </>
        )}
      </ul>

      {/* Icons Section */}
      <div className="flex items-center gap-6">
        <img src={assets.search} className="w-5 h-5 cursor-pointer" alt="Search" />
        <div className='group relative'>
          <img src={assets.profile_icon} className='w-5 h-5 cursor-pointer' alt="" />
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-600 rounded shadow-md'>
              <p className='cursor-pointer hover:text-black'>My Profile</p>
              <p className='cursor-pointer hover:text-black'>Orders</p>
              <p className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>
        </div>
        {!isEcom && <img src={assets.Chat} className="w-5 h-5 cursor-pointer" alt="Chat" />}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            10
          </p>
        </Link>
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 h-5 cursor-pointer sm:hidden" alt="Menu" />
      </div>

      {/* Sidebar Menu for Small Screens */}
      {visible && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white z-50 transition-all duration-300">
          <div className="flex flex-col text-gray-600 p-4">
            <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer border-b">
              <img src={assets.drop_down} className="h-4 rotate-90" alt="Back" />
              <p>Back</p>
            </div>
            {isEcom ? (
              <>
                <NavLink onClick={handleMainNavClick} className="py-3 pl-6 border-b border-gray-300" to="/">
                  Main
                </NavLink>
                <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/Ecom">
                  E-com
                </NavLink>
                <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/collection">
                  COLLECTIONS
                </NavLink>
                <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/contacts">
                  CONTACT-US
                </NavLink>
              </>
            ) : (
              <>
                <NavLink onClick={handleMainNavClick} className="py-3 pl-6 border-b border-gray-300" to="/">
                  Plant Identification
                </NavLink>
                <NavLink onClick={handleMainNavClick} className="py-3 pl-6 border-b border-gray-300" to="/plantDoctor">
                  Plant Doctor
                </NavLink>
                <NavLink onClick={handleMainNavClick} className="py-3 pl-6 border-b border-gray-300" to="/companionPlanting">
                  Companion Planting
                </NavLink>
                <NavLink onClick={handleMainNavClick} className="py-3 pl-6 border-b border-gray-300" to="/plantCare">
                  Plant Care
                </NavLink>
                <NavLink onClick={() => { setIsEcom(true); setVisible(false); }} className="py-3 pl-6 border-b border-gray-300" to="/Ecom">
                  E-com Store
                </NavLink>
                <NavLink onClick={handleMainNavClick} className="py-3 pl-6 border-b border-gray-300" to="/plantationGuide">
                  Planting Guide
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
