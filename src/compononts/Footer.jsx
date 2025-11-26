import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    navigate(path);
    // Scroll to top after navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
        <div className='flex flex-col sm:flex-row gap-14 my-10 mt-20 text-sm border-t border-grey-300 pt-10'>
            <div className='flex flex-col sm:w-1/3'>
                <div className='flex items-center'>
                    <img src={assets.logoResized} className='mb-5 w-16 h-auto' alt="Logo" />
                    <p className='text-grey-800 ml-3 text-xl font-semibold'>EcoBotanica</p>
                </div>
                <p className='w-full md:w-2/3 text-grey-600'>
                    At EcoBotanica, we're dedicated to providing the best plant care solutions to help you grow healthy and vibrant plants. Explore our tools and resources to take your gardening to the next level.
                </p>
            </div>
            <div className='sm:w-1/3'>
                <p className='text-xl font-medium mb-5'>
                    COMPANY
                </p>
                <ul className='flex flex-col gap-1 text-grey-600'>
                    <li>
                        <button 
                            onClick={() => handleLinkClick("/PlantIdentification")} 
                            className="hover:text-green-600 transition-colors text-left"
                        >
                            Plant Identification
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleLinkClick("/plantDoctor")} 
                            className="hover:text-green-600 transition-colors text-left"
                        >
                            Plant Doctor
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleLinkClick("/companionPlanting")} 
                            className="hover:text-green-600 transition-colors text-left"
                        >
                            Companion Planting
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleLinkClick("/plantCare")} 
                            className="hover:text-green-600 transition-colors text-left"
                        >
                            Plant Care
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleLinkClick("/Ecom")} 
                            className="hover:text-green-600 transition-colors text-left"
                        >
                            E-commerce
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleLinkClick("/plantationGuide")} 
                            className="hover:text-green-600 transition-colors text-left"
                        >
                            Planting Guide
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleLinkClick("/placeOrder")} 
                            className="hover:text-green-600 transition-colors text-left"
                        >
                            Delivery
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleLinkClick("/AboutEcobotanica")} 
                            className="hover:text-green-600 transition-colors text-left"
                        >
                            About Us
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleLinkClick("/privacy-policy")} 
                            className="hover:text-green-600 transition-colors text-left"
                        >
                            Privacy Policy
                        </button>
                    </li>
                </ul>
            </div>
            <div className='sm:w-1/3'>
                <p className='text-xl font-medium mb-5'>
                    Get In Touch
                </p>
                <p className='text-grey-600'>
                    Have questions or need help? Reach out to our support team and we'll be happy to assist you with your plant care journey!
                </p>
                <ul className='flex flex-col gap-1 mt-3 text-grey-600'>
                    <li>Email: support@ecobotanica.com</li>
                    <li>Phone: +1 (800) 123-4567</li>
                    <li>Address: 123 Greenway Kashmir, Pakistan</li>
                </ul>
                <div className="mt-4 flex gap-4">
                    <button 
                        onClick={() => handleLinkClick("/contacts")} 
                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                        Contact Us
                    </button>
                    <button 
                        onClick={() => handleLinkClick("/CommunityChat")} 
                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                        Community Chat
                    </button>
                </div>
            </div>
        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ Ecobotanica.com All rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer;