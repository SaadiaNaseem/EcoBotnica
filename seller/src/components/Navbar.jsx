import React, { useState } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { assets } from "../assets/assets.js";

const Navbar = ({ setToken }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // modal state
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMainNavClick = () => {
    window.location.href = "http://localhost:5173/login"; // Redirect to main site
  };
  const handleLogout = () => {
    setToken("");
    window.location.href = "http://localhost:5173/login"; // Redirect after logout
  };

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Add Items", href: "/add" },
    { name: "Active Orders", href: "/orders" },
    { name: "List Items", href: "/list" },
    { name : "Complaints", href: "/website"}
  ];

  return (
    <>
      <div className="flex items-center py-3 px-[4%] justify-between bg-white shadow relative">
        {/* Logo */}
        <div onClick={handleMainNavClick} className="cursor-pointer flex items-center">
          <img
            className="w-8 h-8"
            src={assets.logo}
            alt="Logo"
          />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-green-700 font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Side: Hamburger + Profile */}
        <div className="flex items-center gap-4">
          {/* Hamburger (Mobile only) */}
          <button
            className="md:hidden text-2xl text-gray-700 hover:text-green-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>

          {/* Profile Icon triggers confirmation */}
          <div>
            <FaUserCircle
              className="text-2xl text-gray-700 hover:text-green-700 cursor-pointer"
              onClick={() => setShowLogoutConfirm(true)}
            />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t shadow-md md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Do you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-[20px] hover:opacity-80 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-black text-white px-4 py-2 rounded-[20px] hover:opacity-80 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
