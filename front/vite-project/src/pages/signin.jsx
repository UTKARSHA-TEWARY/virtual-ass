import React, { useState, useContext } from 'react';
import img from '../assets/img.webp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/userContext.jsx';

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { serverUrl, setUserData } = useContext(UserDataContext);
  const [error, setError] = useState('');

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signin`, // ✅ FIXED route
        { email, password },
        { withCredentials: true }
      );
      setUserData(res.data);   // Store user data globally
      navigate('/');           // Redirect to home
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || 'Something went wrong');
      setUserData({});
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000060] backdrop-blur shadow-2xl shadow-black-500 flex flex-col items-center justify-center gap-4 px-[20px]"
        onSubmit={handleSignin}
      >
        <h1 className="text-white text-[22px] font-semibold mb-[30px]">
          Sign in to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder:text-white placeholder:text-[15px] placeholder:font-semibold pl-3 rounded-full text-[18px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder:text-white placeholder:text-[15px] placeholder:font-semibold pl-3 rounded-full text-[18px]"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button className="w-[120px] h-[60px] bg-white text-black font-semibold text-[18px] rounded-full">
          Sign in
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <p
          className="text-white text-[18px] mt-4 cursor-pointer"
          onClick={() => navigate('/signup')}
        >
          Don't have an account?{' '}
          <span className="text-blue-400">Sign up</span>
        </p>
      </form>
    </div>
  );
}

