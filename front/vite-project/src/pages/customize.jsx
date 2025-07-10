import React, { useState, useRef, useContext } from 'react';
import Card from '../components/card.jsx';
import img1 from '../assets/img.webp';
import ai1 from '../assets/ai1.jpeg';
import ai2 from '../assets/ai2.webp';
import a13 from '../assets/a13.jpeg'
import { RiImageAddLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';

import { UserDataContext } from "../context/userContext.jsx";

export default function Customize() {
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    serverUrl,
    userData,
    setUserData,
  } = useContext(UserDataContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  const defaultImages = [img1, ai1, ai2, a13];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setFrontendImage(localUrl);
    setBackendImage(file);
    setSelectedImage(''); // Clear previous selected image
  };

  const handleSelectCard = (cardImageUrl) => {
    setSelectedImage(cardImageUrl);
    setBackendImage(null);
    setFrontendImage(cardImageUrl);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-t from-black to-slate-800 flex flex-col justify-center items-center p-4 relative overflow-x-hidden">
      {/* Back Button */}
      <MdKeyboardBackspace
        className="absolute top-4 left-4 text-white w-6 h-6 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
        Select your <span className="text-blue-500">Virtual Image</span>
      </h1>

      {/* Image Options */}
      <div className="w-full px-4 flex justify-center items-center flex-wrap gap-4 sm:gap-6">
        {defaultImages.map((image, index) => (
          <Card
            key={index}
            image={image}
            onClick={() => handleSelectCard(image)}
            className={`${
              selectedImage === image ? 'border-4 border-white' : 'border-2 border-blue-500'
            }`}
          />
        ))}

        {/* Upload Card */}
        <div
          className={`w-[80px] h-[80px] sm:w-[120px] sm:h-[180px] md:w-[150px] md:h-[250px] ${
            frontendImage && !selectedImage
              ? 'border-4 border-white'
              : 'border-2 border-blue-500'
          } bg-[#030303] rounded-2xl overflow-hidden hover:border-white cursor-pointer flex justify-center items-center`}
          onClick={() => inputImage.current.click()}
        >
          {!frontendImage || selectedImage ? (
            <RiImageAddLine className="text-white w-6 h-6" />
          ) : (
            <img src={frontendImage} alt="Uploaded" className="h-full w-full object-cover" />
          )}
        </div>

        <input type="file" accept="image/*" hidden ref={inputImage} onChange={handleImage} />
      </div>

      {/* Next Button */}
      <button
        className="bg-blue-500 text-black text-base sm:text-lg px-6 py-2 sm:px-8 sm:py-3 rounded-md mt-6 hover:bg-blue-600 transition"
        onClick={() => navigate('/customize2')}
      >
        Next
      </button>
    </div>
  );
}
