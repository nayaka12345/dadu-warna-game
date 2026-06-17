import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this
    methods: ["GET", "POST"]
  }
});

// Initial game state
let gameState = {
  rounds: {
    1: 'user_lose', // 'user_win' (User gets what they pick) or 'user_lose' (User gets a random different color)
    2: 'user_lose',
    3: 'user_lose'
  }
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current state to the connected client
  socket.emit('gameState', gameState);

  // Listen for state updates from Admin
  socket.on('updateAdminState', (newState) => {
    gameState = { ...gameState, ...newState };
    // Broadcast updated state to all clients (User and Admin)
    io.emit('gameState', gameState);
    console.log('State updated:', gameState);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
