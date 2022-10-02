import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Auth from './components/Auth';
import ChatRoom from './components/ChatRoom';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/chatroom/:userId/:room" element={<ChatRoom />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
