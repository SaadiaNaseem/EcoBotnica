import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const location = useLocation();
  const msg = location.state?.msg || "";

  const onSubmitHandler = async (event) => {
    console.log("Form submitted");
    event.preventDefault();

    try {
      // --- ADMIN LOGIN CHECK ---
      if (currentState === 'Admin') {
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'default_admin_email';
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'default_password';

        console.log('Admin Email from .env:', adminEmail);
        console.log('Entered Email:', email);
        console.log('Admin Password from .env:', adminPassword);
        console.log('Entered Password:', password);

        if (email === adminEmail && password === adminPassword) {
          toast.success('Admin login successful');
          navigate('/admindashboard');
          return;
        } else {
          toast.error('Invalid admin credentials');
          return;
        }
      }

      // --- USER REGISTRATION OR LOGIN ---
      let response;
      if (currentState === 'Sign up') {
        response = await axios.post(
          backendUrl + '/api/user/register',
          { name, email, password }
        );
        console.log("Register Response:", response.data);
      } else {
        response = await axios.post(
          backendUrl + '/api/user/login',
          { email, password }
        );
        console.log("Login Response:", response.data);
      }

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        if (response.data.user) {
          console.log("Saving User Data to LocalStorage:", response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          if (response.data.user._id) {
            localStorage.setItem("userId", response.data.user._id);
          }
        }
        
        toast.success(currentState === 'Sign up' ? "Signup successful!" : "Login successful!");
        
        // Navigate after successful login/signup (except for admin)
        if (currentState !== 'Admin') {
          navigate('/Ecom');
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (token && currentState !== 'Admin') {
      navigate('/Ecom');
    }
  }, [token, navigate, currentState]);

  // Reset form when switching between states
  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
  }, [currentState]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
    >
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {msg && <p className="text-red-500 text-sm text-center w-full">{msg}</p>}

      {/* Show Name input only in Sign Up */}
      {currentState === 'Sign up' && (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Name'
          required
        />
      )}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email'
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Password'
        required
      />

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p 
          onClick={() => navigate('/forgot-password')} 
          className='cursor-pointer hover:underline'
        >
          Forgot password?
        </p>
        
        <div className='flex gap-3'>
          {currentState === 'Login' && (
            <>
              <p 
                onClick={() => setCurrentState('Sign up')} 
                className='cursor-pointer hover:underline'
              >
                Create account
              </p>
              <p 
                onClick={() => setCurrentState('Admin')} 
                className='cursor-pointer hover:underline'
              >
                Admin Login
              </p>
            </>
          )}
          {currentState === 'Sign up' && (
            <p 
              onClick={() => setCurrentState('Login')} 
              className='cursor-pointer hover:underline'
            >
              Login
            </p>
          )}
          {currentState === 'Admin' && (
            <p 
              onClick={() => setCurrentState('Login')} 
              className='cursor-pointer hover:underline'
            >
              User Login
            </p>
          )}
        </div>
      </div>

      <button
        type='submit'
        className='bg-black text-white font-light px-8 py-2 mt-4 rounded-[20px] hover:bg-gray-800 transition-colors w-full'
      >
        {currentState === 'Login' 
          ? 'Sign in' 
          : currentState === 'Sign up' 
            ? 'Sign up' 
            : 'Admin Sign in'
        }
      </button>
    </form>
  )
}

export default Login;