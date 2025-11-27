import React from 'react'
import Title from '../compononts/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../compononts/NewsLetterBox'


const Contacts = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.Contact} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Get in Touch</p>
          <p className='text-gray-500'>EcoBotanica <br />123 Greenway Kashmir, Pakistan<br />Suite #12B, Kashmir</p>
          <p className='text-gray-500'>Phone: +1 (800) 123-4567<br />Email: support@ecobotanica.com</p>
          <p className='text-gray-500'>We’re always looking for nature-loving, tech-savvy individuals to join our team. Let’s grow together.</p>
          <button className='border border-black px-5 py-2 hover:bg-black hover:text-white transition-all duration-200'>
            Explore Jobs
          </button>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default Contacts
