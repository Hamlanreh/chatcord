import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Chat from './components/Chat/Chat';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
