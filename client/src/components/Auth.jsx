import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');

  const handleJoinChat = e => {
    e.preventDefault();

    if (!username || !room) {
      setMessage('Provide valid username and room');
      return;
    }

    const createUser = () => {
      fetch('http://localhost:5000/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, room }),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then(res => {
          if (res.status >= 200 && res.status < 400) {
            setMessage('');
            return res.json();
          } else {
            throw new Error('Provide valid username and room');
          }
        })
        .then(({ user }) => {
          navigate(`/chatroom/${user._id}/${room}`);
        })
        .catch(err => {
          setMessage('Provide valid username and room');
        });
    };
    createUser();
  };

  return (
    <div className="auth">
      <form className="auth-form" onSubmit={handleJoinChat}>
        <h1>Join ChatCord</h1>

        <div className="auth-formConrol">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="auth-formConrol">
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

        {message && (
          <div className="auth-error">
            <p>**{`${message}`}**</p>
          </div>
        )}

        <button className="auth-submitBtn" type="submit">
          Join Chat
        </button>
      </form>
    </div>
  );
};

export default Auth;
