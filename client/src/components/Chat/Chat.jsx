import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Chat.css';
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

const Chat = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username');
  const room = searchParams.get('room');
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');

  const scrollToLatestMessage = () => {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  // Message submit
  const handleChatMessage = e => {
    e.preventDefault();
    // Emit chat message
    if (chatMessage) socket.emit('chatMessage', chatMessage);
    // Clear message text
    setChatMessage('');
  };

  // Leave chat room
  const handleLeaveRoom = () => {
    socket.disconnect();
    navigate('/');
  };

  useEffect(() => {
    scrollToLatestMessage();
  }, [messages]);

  useEffect(() => {
    // Join chatroom
    socket.emit('joinRoom', { username, room });

    return () => {
      // socket.off('joinRoom');
    };
  }, [username, room]);

  useEffect(() => {
    // Get room and users
    socket.on('roomUsers', ({ room, users }) => {
      setUserList(users);
      setRoomName(room);
    });

    // Message from server
    socket.on('message', message => {
      setMessages(state => [...state, message]);
    });

    return () => {
      socket.off('roomUsers');
      socket.off('message');
    };
  }, []);

  return (
    <div className="chat">
      <div className="chat-container">
        <aside className="chat-aside">
          <div className="chat-logo">
            <h1>CHAT</h1>
          </div>

          <div className="chat-room">
            <p>{roomName}</p>
          </div>

          <div className="chat-users-container">
            <h4>Users</h4>
            <ul className="chat-users">
              {userList.length > 0 &&
                userList.map((user, index) => (
                  <li key={index + 1} className="chat-user">
                    {user.username}
                  </li>
                ))}
            </ul>
          </div>

          <div className="chat-leaveBox">
            <button
              onClick={() => handleLeaveRoom(roomName)}
              className="chat-leaveBtn"
            >
              Leave Room
            </button>
          </div>
        </aside>

        <main className="chat-content">
          <div className="chat-messages">
            {messages.length > 0 &&
              messages.map((message, index) =>
                message.username === username ? (
                  <article key={index + 1} className="chat-sentMessage">
                    <div>
                      <p>{message.username}</p>
                      <p>{message.time}</p>
                    </div>
                    <p>{message.text}</p>
                  </article>
                ) : (
                  <article key={index + 1} className="chat-receivedMessage">
                    <div>
                      <p>{message.username}</p>
                      <p>{message.time}</p>
                    </div>
                    <p>{message.text}</p>
                  </article>
                )
              )}
          </div>

          <form className="chat-form" onSubmit={handleChatMessage}>
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

export default Chat;
