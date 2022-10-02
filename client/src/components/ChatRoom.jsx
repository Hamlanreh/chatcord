import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatRoom.css';

import io from 'socket.io-client';
const socket = io('http://localhost:5000');

const ChatRoom = () => {
  const navigate = useNavigate();
  const { userId, room } = useParams();

  const [userList, setUserList] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [user, setUser] = useState('');

  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');

  // Scroll down to latest message
  const scrollToLatestMessage = () => {
    const chatMessages = document.querySelector('.chatRoom-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  // Send message
  const handleSendMessage = e => {
    e.preventDefault();
    // Emit chat message
    if (chatMessage) socket.emit('chatMessage', chatMessage);
    socket.off('chatMessage');
    // Clear message text
    setChatMessage('');
  };

  // Leave chat room
  const handleLeaveRoom = async (room, userId) => {
    // Delete user and room
    await fetch(`http://localhost:5000/api/v1/auth/deleteUser/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
    // Disconnect the socket connection
    socket.disconnect();
    // Return to login
    navigate('/');
  };

  useEffect(() => {
    scrollToLatestMessage();
  }, [messages]);

  useEffect(() => {
    if (!userId || !room) navigate('/');

    // Get user by userId
    const getUser = async () => {
      const res = await fetch(
        `http://localhost:5000/api/v1/auth/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        }
      );
      const { user } = await res.json();

      // If user doesn't exist return to login
      if (!user) return navigate('/');

      setUser(user);
      setRoomName(user.room);
    };
    getUser();
  }, [navigate, userId, room]);

  useEffect(() => {
    if (!user._id) return;

    // Join a chat room
    socket.emit('joinRoom', { user: user, room: user.room });

    return () => {
      socket.off('joinRoom');
    };
  }, [user]);

  useEffect(() => {
    socket.on('roomUsers', room => {
      // Get all users in room
      const getRoomUsers = async () => {
        const res = await fetch(
          `http://localhost:5000/api/v1/auth/getRoomUsers/${room}`,
          {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
            },
          }
        );
        const { data } = await res.json();
        setUserList([...data]);
      };
      getRoomUsers();
    });

    return () => {
      socket.off('roomUsers');
    };
  }, []);

  useEffect(() => {
    // Message handler from server
    socket.on('message', message => {
      setMessages(state => [...state, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', e => {
      e.preventDefault();
      handleLeaveRoom(roomName, user._id);
    });
  }, [handleLeaveRoom, roomName, user]);

  return (
    <div className="chatRoom">
      <div className="chatRoom-container">
        <aside className="chatRoom-aside">
          <div className="chatRoom-logo">
            <h1>ANONCHAT</h1>
          </div>

          {room && (
            <div className="chatRoom-room">
              <p>{user.username}</p>
              <p>{user.room}</p>
            </div>
          )}

          <div className="chatRoom-users-container">
            <h4>USERS</h4>
            <ul className="chatRoom-users">
              {userList.length > 0 &&
                userList.map((user, index) => (
                  <li key={index + 1} className="chatRoom-user">
                    {user.username}
                  </li>
                ))}
            </ul>
          </div>

          <div className="chatRoom-leaveBox">
            <button
              onClick={() => handleLeaveRoom(roomName, user._id)}
              className="chatRoom-leaveBtn"
            >
              Leave Room
            </button>
          </div>
        </aside>

        <main className="chatRoom-content">
          <div className="chatRoom-messages">
            {messages.length > 0 &&
              messages.map((message, index) =>
                message.username === user.username ? (
                  <article key={index + 1} className="chatRoom-sentMessage">
                    <div>
                      <p>{message.username}</p>
                      <p>{message.time}</p>
                    </div>
                    <p>{message.text}</p>
                  </article>
                ) : (
                  <article key={index + 1} className="chatRoom-receivedMessage">
                    <div>
                      <p>{message.username}</p>
                      <p>{message.time}</p>
                    </div>
                    <p>{message.text}</p>
                  </article>
                )
              )}
          </div>

          <form className="chatRoom-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Enter Message..."
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatRoom;
