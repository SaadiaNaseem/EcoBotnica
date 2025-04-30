import React from 'react'
import {assets} from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-grey-700'>
        <div>
            <img src={assets.Exchange_icon} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Easy Excahange Policy</p>
            <p className='text-grey-400'>We offer Hassel Free Exchange Policy</p>
        </div>
        <div>
            <img src={assets.Quality} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>7 Days Return Policy</p>
            <p className='text-grey-400'>Return items within 7 days, no questions asked.</p>
        </div>
        <div>
            <img src={assets.Customer} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Best Customer Support</p>
            <p className='text-grey-400'>We’re here to help, anytime.</p>
        </div>
    </div>
  )
}

export default OurPolicy