// components/OTPVerification.jsx - COMPLETE UPDATED
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OTPVerification = ({ email, onStepChange, onOtpChange, backendUrl }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      onOtpChange(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(backendUrl + '/api/user/verify-otp', {
        email,
        otp: otpString
      });

      if (response.data.success) {
        toast.success('OTP verified successfully!');
        setOtp(['', '', '', '', '', '']);
        onOtpChange(['', '', '', '', '', '']);
        onStepChange(3);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const response = await axios.post(backendUrl + '/api/user/forgot-password', { email });
      
      if (response.data.success) {
        toast.success('New OTP sent to your email');
        setOtp(['', '', '', '', '', '']);
        onOtpChange(['', '', '', '', '', '']);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Network error');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full">
      <p className="text-sm text-gray-600 mb-4 text-center">
        We sent a 6-digit code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleVerifyOTP}>
        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-800 rounded-md focus:border-gray-800 focus:ring-1 focus:ring-gray-800 outline-none"
              disabled={loading}
            />
          ))}
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className='bg-black text-white font-light px-8 py-2 rounded-[20px] w-full disabled:opacity-50'
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className='w-full text-gray-800 py-2 rounded-[20px] font-light border border-gray-800 hover:bg-gray-800 hover:text-white transition disabled:opacity-50'
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;