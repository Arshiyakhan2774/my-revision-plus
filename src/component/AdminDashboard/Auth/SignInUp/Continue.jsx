import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useDispatch } from 'react-redux';
import { Api } from '../../../Api/Api';
import { setUserResponse } from '../../../store/UserSliceId';



const Continue = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateForm = () => {
    if (!email) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
  
    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
  
    try {
      const credentials = { email, password };
      const response = await Api.post('/users/login', credentials); 
  
      console.log('Full response:', response); 
  
      const token = response?.data?.token;
      const user = response?.data?.data?.user || response?.data?.user;
  
      if (token && user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userResponse', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        dispatch(setUserResponse(user));
  
        const usertypeId = user.usertype_id;
  
        if (user.parent && user.parent.email === email) {
          navigate('/parent-dashboard');
        } else if (usertypeId === '67261122db316f5b66905278') {
          navigate('/teacher-dashboard');
        } else if (usertypeId === '6730ea0590eb66bde2c2bb6b') {
          navigate('/student-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMsg('Login failed: Token or user data not received.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Login failed: Invalid credentials or server error.';
      setErrorMsg(msg);
    }
  };
  
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-100 overflow-hidden">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-left mb-4 text-black">
        <header className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <span className="flex items-center text-[#f5f5f5]">
          <div className="flex items-center justify-center w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-lg text-2xl font-bold bg-gradient-to-r from-[#1a73e8] to-[#1a73e8] mr-2.5">
            M⁺
          </div>
          <h5 className="overflow-hidden whitespace-nowrap text-black text-xl leading-[30px] transition-opacity duration-300 opacity-100">
        MyRevision⁺
          </h5>
        </span>
      </div>
     
    </header>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Sign in</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">to continue to MyRevision+</p>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <div className="relative w-full mb-4">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={() => setShow(!show)}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <div className="text-right mb-6">
          <span className="text-blue-600 text-sm cursor-pointer hover:underline">
            Forgot password?
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Don't have an account?</span>
          <button
            type="button"
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            Create account
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#1a73e8] text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Continue;
