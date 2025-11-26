import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token } = useContext(ShopContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle button click and navigate
  const handleClick = () => {
    if (token) {
      navigate("/UserDashboard");
    } else {
      navigate("/login");
    }
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

        {/* Right: Login/Dashboard Icon (visible on medium screens and up) */}
        <motion.button
          whileHover={{ scale: 1.1, color: "#16a34a" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="hidden md:block text-2xl text-gray-800 hover:text-green-600 transition-colors"
        >
          <FiLogIn />
        </motion.button>

        {/* Hamburger Menu Icon (visible on small screens) */}
        <motion.div
          className="md:hidden flex items-center"
          onClick={toggleMenu}
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
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/AboutEcobotanica"
            className="text-gray-800 hover:text-green-600 transition-colors font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <motion.button
            whileHover={{ scale: 1.1, color: "#16a34a" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              handleClick();
              setIsMenuOpen(false);
            }}
            className="text-2xl text-gray-800 hover:text-green-600 transition-colors"
          >
            <FiLogIn />
          </motion.button>
        </div>
      )}

    </motion.nav>
  );
}