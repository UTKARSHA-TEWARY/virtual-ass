import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from './pages/signup.jsx';
import Signin from './pages/signin.jsx';
import Customize from './pages/customize.jsx';
import Customize2 from './pages/customize2.jsx';
// src/main.jsx or src/App.jsx
import './index.css'; // or wherever your CSS is

import Home from './pages/home.jsx';
import { UserDataContext } from './context/userContext.jsx';

function App() {
  const { userData } = useContext(UserDataContext);

  const isAuthenticated = !!userData?.email;
  const isAssistantSetup = !!userData?.assistantImage && !!userData?.assistantname;

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated && isAssistantSetup
            ? <Home />
            : isAuthenticated
              ? <Navigate to="/customize" />
              : <Navigate to="/signin" />
        }
      />
      <Route
        path="/signup"
        element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!isAuthenticated ? <Signin /> : <Navigate to="/" />}
      />
      <Route
        path="/customize"
        element={isAuthenticated ? <Customize /> : <Navigate to="/signup" />}
      />
      <Route
        path="/customize2"
        element={isAuthenticated ? <Customize2 /> : <Navigate to="/signup" />}
      />
      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;

