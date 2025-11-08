import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets"; // adjust path if needed
import { FiLogIn, FiMenu, FiX } from "react-icons/fi"; // Added FiMenu and FiX for toggle
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

export default function Navbar() {
  const navigate = useNavigate(); // Initialize navigate function
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility

  // Function to handle button click and navigate to login page
  const handleClick = () => {
    navigate("/login");  // Navigate to the /login route
  };

  // Function to toggle the menu open and closed
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full fixed top-0 left-0 bg-white/80 backdrop-blur-md z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Left: Logo + Title */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={assets.logoResized}
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-semibold tracking-wide">
            <span className="text-green-600">Eco</span>Botanica
          </span>
        </Link>

        {/* Center: Navigation Links (visible on medium screens and up) */}
        <div className="hidden md:flex items-center space-x-10">
          <Link
            to="/"
            className="text-gray-800 hover:text-green-600 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/AboutEcobotanica"
            className="text-gray-800 hover:text-green-600 transition-colors font-medium"
          >
            About Us
          </Link>
        </div>

        {/* Right: Login Icon (visible on medium screens and up) */}
        <motion.button
          whileHover={{ scale: 1.1, color: "#16a34a" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}  // Call handleClick to navigate to login
          className="hidden md:block text-2xl text-gray-800 hover:text-green-600 transition-colors"
        >
          <FiLogIn />  {/* Assuming you want to display the login icon */}
        </motion.button>

        {/* Hamburger Menu Icon (visible on small screens) */}
        <motion.div
          className="md:hidden flex items-center"
          onClick={toggleMenu}  // Toggle menu visibility
        >
          {isMenuOpen ? (
            <FiX className="text-2xl text-gray-800" />
          ) : (
            <FiMenu className="text-2xl text-gray-800" />
          )}
        </motion.div>
      </div>

      {/* Mobile Menu (visible when isMenuOpen is true) */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 bg-white/80 backdrop-blur-md p-6 shadow-md">
          <Link
            to="/"
            className="text-gray-800 hover:text-green-600 transition-colors font-medium"
            onClick={() => setIsMenuOpen(false)}  // Close menu after link click
          >
            Home
          </Link>
          <Link
            to="/AboutEcobotanica"
            className="text-gray-800 hover:text-green-600 transition-colors font-medium"
            onClick={() => setIsMenuOpen(false)}  // Close menu after link click
          >
            About Us
          </Link>
          <motion.button
            whileHover={{ scale: 1.1, color: "#16a34a" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}  // Call handleClick to navigate to login
            className="text-2xl text-gray-800 hover:text-green-600 transition-colors"
          >
            <FiLogIn />
          </motion.button>
        </div>
      )}

    </motion.nav>
  );
}
