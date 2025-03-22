import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row border border-grey-400'>
            {/*Hero left Side */}
            <div className='w-full sm:w-1.2 flex items-center justify-center py-10 sm:py-0'>
                <div className='text-[#414141]'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141] self-center'></p>
                        <p className='font-medium text-sm md:text-base'>BEST SELLERS</p>
                    </div>
                    <h1 className='text-3xl sm:py-3 lg:text-5xlnleading-relaxed'>CURRENTLY IN DEMAND</h1>
                    <div className='flex items-center gap-2'>
                        <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141] self-center'></p>
                    </div>
                </div>
            </div>
            {/*Hero Right side*/}
            <img className='w-full h-80 sm:w-1/2 sm:h-96' src={assets.Hero_pic} alt="" />
        </div>
    )
}

export default Hero