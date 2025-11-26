import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { FiBell, FiMessageCircle, FiShoppingCart, FiUser, FiMenu, FiLogIn } from "react-icons/fi";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const location = useLocation();
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  // Check if current page is Ecom or its subpages
  const isEcomPage = location.pathname === '/Ecom' || 
                     location.pathname === '/collection' || 
                     location.pathname === '/aboutUs' || 
                     location.pathname === '/contacts';

  // Check if current page is notification page
  const isNotificationPage = location.pathname === '/notification';

  // Simulate new notifications (replace with actual API call)
  useEffect(() => {
    if (token) {
      // Simulate checking for new notifications
      const checkNewNotifications = () => {
        // Replace this with actual API call to check for new notifications
        const hasNew = Math.random() > 0.5; // 50% chance of new notifications
        setHasNewNotifications(hasNew);
      };

      checkNewNotifications();
      
      // Check for new notifications every 30 seconds
      const interval = setInterval(checkNewNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [token]);

  // Clear notification dot when notification page is opened
  useEffect(() => {
    if (isNotificationPage && hasNewNotifications) {
      setHasNewNotifications(false);
      // Here you would typically mark notifications as read in your backend
    }
  }, [isNotificationPage, hasNewNotifications]);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    setHasNewNotifications(false);
  };

  const handleMainNavClick = () => {
    setVisible(false);
  };

  const handleNotificationClick = () => {
    // Clear the dot when user clicks on notification icon
    setHasNewNotifications(false);
    navigate('/notification');
  };

  // Not logged in - show only home, about + login
  if (!token) {
    return (
      <div className="flex items-center justify-between py-5 px-8 font-medium">
        {/* Logo */}
        <Link to='/'><img src={assets.logoResized} className="w-5 h-5" alt="Logo" /></Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-5 text-sm text-black">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>Home</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
          </NavLink>
          <NavLink to="/AboutEcobotanica" className="flex flex-col items-center gap-1">
            <p>About Us</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
          </NavLink>
        </ul>

        {/* Icons Section */}
        <div className="flex items-center gap-6">
          {/* Login Icon */}
          <Link to="/login" className="text-gray-800 hover:text-green-600 transition-colors">
            <FiLogIn className="w-5 h-5 cursor-pointer" />
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
              <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/">
                Home
              </NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/AboutEcobotanica">
                About Us
              </NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/login">
                Login
              </NavLink>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Logged in - show appropriate navbar based on current page
  return (
    <div className="flex items-center justify-between py-5 px-8 font-medium">
      {/* Logo */}
      <Link to='/UserDashboard' onClick={handleMainNavClick}>
        <img src={assets.logoResized} className="w-5 h-5" alt="Logo" />
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden sm:flex gap-5 text-sm text-black">
        {!isEcomPage ? (
          // Main App Navigation
          <>
            <NavLink to="/UserDashboard" className="flex flex-col items-center gap-1" onClick={handleMainNavClick}>
              <p>Dashboard</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/PlantIdentification" className="flex flex-col items-center gap-1" onClick={handleMainNavClick}>
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
            <NavLink to="/Ecom" className="flex flex-col items-center gap-1">
              <p>E-com Store</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/plantationGuide" className="flex flex-col items-center gap-1" onClick={handleMainNavClick}>
              <p>Planting Guide</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
          </>
        ) : (
          // Ecom Navigation
          <>
            <NavLink to="/Ecom" className="flex flex-col items-center gap-1">
              <p>E-com</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/collection" className="flex flex-col items-center gap-1">
              <p>COLLECTION</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-black self-center hidden' />
            </NavLink>
            <NavLink to="/aboutUs" className="flex flex-col items-center gap-1">
              <p>ABOUT US</p>
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
        {/* Profile with Dropdown */}
        <div className='group relative'>
          <FiUser className='w-5 h-5 cursor-pointer text-gray-800' />
          {token && (
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-600 rounded shadow-md'>
                <NavLink to="/profilePage">
                  <p className='cursor-pointer hover:text-black text-gray-800'>My Profile</p>
                </NavLink>
                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          )}
        </div>

        {/* Community Chat */}
        {!isEcomPage && (
          <Link to="/CommunityChat">
            <FiMessageCircle className="w-5 h-5 cursor-pointer text-gray-800" />
          </Link>
        )}

        {/* Cart */}
        <Link to="/cart" className="relative">
          <FiShoppingCart className="w-5 min-w-5 text-gray-800" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Notification Bell */}
        <button onClick={handleNotificationClick} className="relative">
          <FiBell className="w-5 h-5 cursor-pointer text-gray-800" />
          {hasNewNotifications && !isNotificationPage && (
            <div className="absolute right-[-2px] top-[-2px] w-2 h-2 bg-red-600 rounded-full"></div>
          )}
        </button>

        {/* Mobile Menu Icon */}
        <FiMenu onClick={() => setVisible(true)} className="w-5 h-5 cursor-pointer sm:hidden text-gray-800" />
      </div>

      {/* Sidebar Menu for Small Screens */}
      {visible && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white z-50 transition-all duration-300">
          <div className="flex flex-col text-gray-600 p-4">
            <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer border-b">
              <img src={assets.drop_down} className="h-4 rotate-90" alt="Back" />
              <p>Back</p>
            </div>
            {isEcomPage ? (
              // Ecom Mobile Menu
              <>
                <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/Ecom">
                  E-com
                </NavLink>
                <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/collection">
                  COLLECTIONS
                </NavLink>
                <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/aboutUs">
                  ABOUT US
                </NavLink>
                <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/contacts">
                  CONTACT-US
                </NavLink>
              </>
            ) : (
              // Main App Mobile Menu
              <>
                <NavLink onClick={handleMainNavClick} className="py-3 pl-6 border-b border-gray-300" to="/UserDashboard">
                  Dashboard
                </NavLink>
                <NavLink onClick={handleMainNavClick} className="py-3 pl-6 border-b border-gray-300" to="/PlantIdentification">
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
                <NavLink onClick={() => { setVisible(false); }} className="py-3 pl-6 border-b border-gray-300" to="/Ecom">
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