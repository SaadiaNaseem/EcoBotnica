import React from "react";
import { useNavigate } from "react-router-dom";

const ChooseRole = () => {
  const navigate = useNavigate();

  const handleSeller = () => {
    // Seller → admin panel
    window.location.href = "http://localhost:5174";
  };

  const handleBuyer = () => {
    // Buyer → normal login
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-6 text-gray-800">
      
      {/* Heading jesi login page mei hai */}
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Choose Role</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Message */}
      <p className="text-center text-gray-600 text-sm">
        Do you want to continue as a <span className="font-medium">Seller</span> or a <span className="font-medium">Buyer</span>?
      </p>

      {/* Buttons */}
      <div className="flex gap-6 mt-4">
        <button 
          onClick={handleSeller} 
          className="bg-black text-white font-light px-8 py-2 rounded-[20px] hover:bg-gray-800 transition"
        >
          Seller
        </button>
        <button 
          onClick={handleBuyer} 
          className="bg-green-600 text-white font-light px-8 py-2 rounded-[20px] hover:bg-green-700 transition"
        >
          Buyer
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;
