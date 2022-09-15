import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleJoinChat = e => {
    e.preventDefault();
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleJoinChat}>
        <h1>Join ChatCord</h1>

        <div className="login-formConrol">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="login-formConrol">
          <select value={room} onChange={e => setRoom(e.target.value)}>
            <option defaultValue="">-- Select Room --</option>
            <option value="react">React</option>
            <option value="javascript">JavaScript</option>
            <option value="c#">C#</option>
            <option value="c++">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="nodejs">Node.js</option>
          </select>
        </div>

        <button className="login-submitBtn" type="submit">
          Join Chat
        </button>

        <p className="login-info">
          Create a new account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
