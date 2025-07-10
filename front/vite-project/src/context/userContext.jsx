// ============================== //
//         userContext.jsx        //
// ============================== //

import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';

export const UserDataContext = createContext();

export default function UserContextProvider({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState({});
  const [frontendImage, setFrontendImage] = useState('');
  const [backendImage, setBackendImage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const handleCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true
      });
      setUserData(res.data);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );

      if (res.data && typeof res.data === 'object') {
        return res.data;
      } else {
        return {
          type: "general",
          userInput: command,
          response: "Sorry, I didn't understand that."
        };
      }
    } catch (err) {
      console.error('Failed to get Gemini response:', err);
      return {
        type: "general",
        userInput: command,
        response: "Sorry, the assistant failed to respond."
      };
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}
