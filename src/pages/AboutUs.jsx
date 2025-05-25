import React from 'react'
import Title from '../compononts/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../compononts/NewsLetterBox'

const AboutUs = () => {
    return (
        <div>
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'ABOUT'} text2={'US'} />
            </div>
            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img className='w-full md: max-w-[450px]' src={assets.About} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-grey-600'>
                    <p>Welcome to EcoBotanica — your smart companion for greener, healthier living. Whether you're caring for one plant or many, EcoBotanica uses AI to help you identify plants, detect issues early, and get personalized care tips. With features like growth tracking and AR-guided companion planting, we make plant care simple, smart, and satisfying.</p>
                    <p>Our built-in ecommerce feature lets you explore and shop a curated range of healthy plants, quality seeds, and essential fertilizers — all within EcoBotanica. From care to cultivation, it's your all-in-one space to grow with confidence.</p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>EcoBotanica’s mission is to empower every plant lover with intelligent tools to grow, heal, and thrive. By blending AI-driven care, AR-guided planting, and a built-in ecommerce experience, we aim to simplify plant health management and make sustainable gardening accessible to all. From diagnosis to delivery, EcoBotanica is your all-in-one ecosystem for smart, informed, and joyful plant care.</p>
                </div>
            </div>
            <div className='text-4xl py-4'>
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>
            <div className='flex flex-col md:flex-row flex-wrap text-sm mb-20'>
                <div className='border px-6 md:px-8 py-8 sm:py-20 flex flex-col gap-5 w-full md:w-1/2 lg:w-1/4'>
                    <b>AI-Powered Plant Care</b>
                    <p className='text-gray-600'>EcoBotanica uses smart technology to identify plants, diagnose issues early, and offer personalized care — helping you grow healthier plants with confidence.</p>
                </div>
                <div className='border px-6 md:px-8 py-8 sm:py-20 flex flex-col gap-5 w-full md:w-1/2 lg:w-1/4'>
                    <b>Smart Growth & AR Guidance</b>
                    <p className='text-gray-600'>Visualize your garden like never before with growth tracking and AR-based companion planting. Make better choices, beautifully and intuitively.</p>
                </div>
                <div className='border px-6 md:px-8 py-8 sm:py-20 flex flex-col gap-5 w-full md:w-1/2 lg:w-1/4'>
                    <b>Curated Green Marketplace</b>
                    <p className='text-gray-600'>Shop healthy plants, premium seeds, and eco-friendly fertilizers — all carefully selected to meet your garden’s needs, delivered to your doorstep.</p>
                </div>
                <div className='border px-6 md:px-8 py-8 sm:py-20 flex flex-col gap-5 w-full md:w-1/2 lg:w-1/4'>
                    <b>Exceptional Customer Support</b>
                    <p className='text-gray-600'>Whether you're new to plants or a seasoned gardener, our friendly team is here to help — with real-time assistance, expert advice, and a smile, every step of the way.</p>
                </div>
            </div>
            <NewsletterBox/>

        </div>
    )
}

export default AboutUs