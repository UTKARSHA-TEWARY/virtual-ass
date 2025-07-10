import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import axios from 'axios';
import { UserDataContext } from '../context/userContext.jsx';

function Customize2() {
  const {
    userData,
    setUserData,
    serverUrl,
    frontendImage,
    backendImage,
    selectedImage,
  } = useContext(UserDataContext);

  const [name, setName] = useState(userData?.assistantName || '');
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      const formData = new FormData();
      formData.append('assistantname', name);

      if (backendImage) formData.append('file', backendImage);
      if (selectedImage) formData.append('imageurl', selectedImage);

      const res = await axios.put(`${serverUrl}/api/user/update`, formData, {
        withCredentials: true,
      });

      setUserData(res.data);
      navigate('/');
    } catch (error) {
      console.error('❌ Failed to update assistant:', error);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-t from-black to-slate-800 flex flex-col justify-center items-center px-4 py-10 relative">

      {/* Back button */}
      <MdKeyboardBackspace
        className="absolute top-4 left-4 text-white w-6 h-6 cursor-pointer"
        onClick={() => navigate('/customize')}
      />

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
        Enter your <span className="text-blue-500">assistant name</span>
      </h1>

      {/* Input */}
      <input
        type="text"
        placeholder="e.g. Shipra"
        className="w-full max-w-[500px] h-[50px] sm:h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder:text-white placeholder:text-base px-5 py-2 rounded-full text-lg mb-6"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      {/* Button */}
      <button
        className="bg-blue-500 text-black text-lg font-semibold px-6 py-3 rounded-full w-full max-w-[200px] hover:bg-blue-600 transition"
        onClick={handleUpdateAssistant}
      >
        Create
      </button>
    </div>
  );
}

export default Customize2;


