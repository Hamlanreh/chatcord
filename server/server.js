const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

if (process.env.NODE_ENV !== 'production')
  require('dotenv').config({ path: `${__dirname}/config/config.env` });

const app = require('./app');
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

const botName = 'Chatchord bot';

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    // Join user to chat room
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', message => {
    const user = getCurrentUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(user.username, message));
    }
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    console.log(user);

    io.to(user.room).emit(
      'message',
      formatMessage(botName, `${user.username} has left the chat`)
    );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
