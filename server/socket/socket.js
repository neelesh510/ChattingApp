// const { Server } = require('socket.io');

// const setupSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: 'http://localhost:3000', // Update to match your frontend URL
//       methods: ['GET', 'POST'],
//       credentials: true
//     },
//   });

//   io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);

//     socket.on('user-message', (message) => {
//       console.log('Received message:', message);
//       io.emit('message', message); // Broadcast the message to all clients
//     });

//     socket.on('joinRoom', (roomId) => {
//         socket.join(roomId);
//         console.log(`Socket ${socket.id} joined room ${roomId}`);
//       });

//     socket.on('disconnect', () => {
//       console.log('Client disconnected:', socket.id);
//     });
//   });

//   return io;
// };

// module.exports = { setupSocket };

const { Server } = require('socket.io');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', // Update to match your frontend URL
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Register the user and join their specific room
    socket.on('register', (userId) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} registered as user ${userId}`);
    });

    // Handle user messages
    socket.on('user-message', (message) => {
      const { receiverId } = message;
      console.log('Received message:', message);
      io.to(receiverId).emit('message', message); // Emit message only to the recipient's room
    });

    // Handle room joining
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = { setupSocket };

