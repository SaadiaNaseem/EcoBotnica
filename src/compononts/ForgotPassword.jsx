// components/ForgotPassword.jsx - COMPLETE UPDATED
import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import OTPVerification from './OTPVerification';
import ResetPassword from './ResetPassword';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { backendUrl, navigate } = useContext(ShopContext);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(backendUrl + '/api/user/forgot-password', { email });
      
      if (response.data.success) {
        toast.success('OTP sent to your email');
        setStep(2);
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOTP} className="w-full">
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-3 py-2 border border-gray-800'
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className='bg-black text-white font-light px-8 py-2 mt-4 rounded-[20px] w-full disabled:opacity-50'
            >
              {loading ? 'Sending OTP...' : 'Send Reset Code'}
            </button>
          </form>
        );
      case 2:
        return (
          <OTPVerification 
            email={email} 
            onStepChange={setStep}
            onOtpChange={setOtp}
            backendUrl={backendUrl}
          />
        );
      case 3:
        return (
          <ResetPassword 
            email={email}
            backendUrl={backendUrl}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Forgot Password';
      case 2: return 'Verify OTP';
      case 3: return 'Reset Password';
      default: return 'Forgot Password';
    }
  };

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{getStepTitle()}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {step === 1 && (
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter your email to receive a reset code
        </p>
      )}

      {renderStep()}

      <div className='w-full flex justify-between text-sm mt-4'>
        <p onClick={() => navigate('/login')} className='cursor-pointer text-gray-600 hover:text-gray-800'>
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;