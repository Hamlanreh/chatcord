const http = require('http');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

if (process.env.NODE_ENV !== 'production')
  require('dotenv').config({ path: `${__dirname}/config/config.env` });

const app = require('./app');
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log('Database has successfully connected');

  // Socketio connection operations
  const botName = 'Chatchord bot';

  io.on('connection', socket => {
    // Join a room
    socket.on('joinRoom', ({ user, room }) => {
      // User joins a chat room
      socket.join(room);

      // Welcome user to chat room
      socket.emit(
        'message',
        formatMessage(botName, `Hi ${user.username}, welcome to chatchord`)
      );

      // Notify all users in the chat room
      socket.broadcast
        .to(room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`)
        );

      // Send get room users
      io.to(user.room).emit('roomUsers', user.room);

      // Listen for chat message
      socket.on('chatMessage', message => {
        io.to(room).emit('message', formatMessage(user.username, message));
      });

      // Disconnect user connection
      socket.on('disconnect', () => {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`)
        );

        // Send get room users
        io.to(user.room).emit('roomUsers', user.room);
      });
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Application is listening on port ${PORT}`);
});
