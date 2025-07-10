import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiMenuAltRight } from 'react-icons/bi';
import { RxCross1 } from 'react-icons/rx';
import { UserDataContext } from '../context/userContext.jsx';
import userImg from '../assets/user.gif';
import ai from '../assets/ai.gif';

function Home() {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState('');
  const [aiText, setAiText] = useState('');
  const [ham, setHam] = useState(false);

  const isRecognizingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const {
    userData,
    setUserData,
    getGeminiResponse,
    serverUrl,
  } = useContext(UserDataContext);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData({});
      navigate('/signin');
    } catch (error) {
      console.error(error);
      setUserData({});
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    const voices = synth.getVoices();
    const voice = voices.find((v) => v.lang === 'en-IN' || v.lang === 'en-US');
    if (voice) utterance.voice = voice;

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText('');
      isSpeakingRef.current = false;
      setTimeout(() => {
        safeRecognize();
      }, 500);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    if (!data || typeof data !== 'object') {
      console.error("❌ Invalid command data:", data);
      speak("Sorry, I didn't understand that.");
      return;
    }

    const { type, userInput, response } = data;

    if (!response) {
      console.error("❌ No response from AI:", data);
      speak("I'm not sure how to respond to that.");
      return;
    }

    console.log("✅ Action:", type);
    speak(response);

    const encoded = encodeURIComponent(userInput);
    const urlMap = {
      google_search: `https://www.google.com/search?q=${encoded}`,
      youtube_search: `https://www.youtube.com/results?search_query=${encoded}`,
      youtube_play: `https://www.youtube.com/results?search_query=${encoded}`,
      instagram_open: `https://www.instagram.com/`,
      weather_show: `https://www.google.com/search?q=weather`,
      calculator_open: `https://www.google.com/search?q=calculator`,
    };

    if (urlMap[type]) {
      setTimeout(() => {
        window.open(urlMap[type], '_blank');
      }, 1000);
    }
  };

  const safeRecognize = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        console.log("🎤 Recognition restarted");
      } catch (err) {
        console.warn("⚠️ Could not start recognition:", err.message);
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    let isMounted = true;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("🎤 Listening started");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) safeRecognize();
        }, 800);
      }
    };

    recognition.onerror = (error) => {
      console.error("Speech recognition error:", error);
      isRecognizingRef.current = false;
      setListening(false);
      setTimeout(() => {
        if (isMounted && !isSpeakingRef.current) safeRecognize();
      }, 1000);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("🗣️ Heard:", transcript);

      const nameLower = userData?.assistantName?.toLowerCase() || "";
      if (transcript.toLowerCase().includes(nameLower)) {
        try {
          setUserText(transcript);
          setAiText('');
          recognition.stop();
          isRecognizingRef.current = false;
          setListening(false);

          const data = await getGeminiResponse(transcript);
          console.log("🤖 Gemini response:", data);
          handleCommand(data);
          setAiText(data?.response || "");
          setUserText("");
        } catch (err) {
          console.error("❌ Error fetching Gemini response:", err);
          speak("There was an error processing your request.");
        }
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognize();
      }
    }, 1500);

    const greeting = new SpeechSynthesisUtterance(
      userData?.assistantName ? `Hello, I am ${userData.assistantName}` : "Hello, I am your assistant"
    );
    greeting.lang = 'en-IN';
    synth.speak(greeting);

    safeRecognize();

    return () => {
      isMounted = false;
      clearInterval(fallback);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-t from-black to-slate-800 flex flex-col items-center gap-8 overflow-x-hidden px-4 py-10 sm:py-12 md:py-16 relative">

      {/* Hamburger Button - Hidden when drawer is open */}
      {!ham && (
        <BiMenuAltRight
          className="lg:hidden fixed top-4 left-4 text-white w-8 h-8 z-50 cursor-pointer"
          onClick={() => setHam(true)}
        />
      )}

      {/* Side Menu Drawer */}
      <div className={`fixed z-40 top-0 right-0 w-full h-full bg-[#00000090] backdrop-blur-lg p-6 pt-14 flex flex-col gap-6 transition-transform duration-300 ${ham ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Cross Icon */}
        <RxCross1
          className="absolute top-4 right-4 text-white w-8 h-8 z-50 cursor-pointer"
          onClick={() => setHam(false)}
        />

        <button className="w-full py-3 bg-white text-black font-semibold text-lg rounded-full" onClick={handleLogOut}>
          LogOut
        </button>
        <button className="w-full py-3 bg-white text-black font-semibold text-lg rounded-full" onClick={() => navigate('/customize')}>
          Customize
        </button>

        <div className="w-full h-px bg-gray-500"></div>

        <h1 className="text-2xl font-bold text-white">History</h1>
        <div className="w-full max-h-[50vh] overflow-auto flex flex-col gap-2 pr-2">
          {Array.isArray(userData?.history) && userData.history.length > 0 ? (
            userData.history.map((his, index) => (
              <span key={index} className="text-gray-200 text-base truncate">
                {his}
              </span>
            ))
          ) : (
            <span className="text-gray-400 italic">No history found.</span>
          )}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex w-full justify-between px-6">
        <button className="px-4 py-2 bg-white text-black font-semibold rounded-full" onClick={handleLogOut}>
          LogOut
        </button>
        <button className="px-4 py-2 bg-white text-black font-semibold rounded-full" onClick={() => navigate('/customize')}>
          Customize
        </button>
      </div>

      {/* Assistant Image */}
      <div className="w-full max-w-[500px] aspect-video flex justify-center items-center overflow-hidden rounded-2xl shadow-2xl">
        <img src={userData?.assistantImage} className="w-full h-full object-cover" alt="Assistant" />
      </div>

      {/* Assistant Name */}
      <h1 className="text-3xl font-bold text-white text-center">
        {userData?.assistantName ? `I'm ${userData.assistantName}` : "I'm your assistant"}
      </h1>

      {/* Assistant/User Status */}
      <img
        src={aiText ? ai : userImg}
        className="w-[120px] sm:w-[160px] md:w-[200px]"
        alt={aiText ? "AI Response" : "User"}
      />

      {/* Spoken or Response Text */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white text-center px-4 break-words max-w-[90vw]">
        {userText || aiText}
      </h1>
    </div>
  );
}

export default Home;
