import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { handleUserConnection, handleUserDisconnection } from './controllers/userController.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/battleship';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Routes
app.use('/api/users', userRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Handle user registration
  socket.on('register-user', async (username) => {
    try {
      const user = await handleUserConnection(username, socket.id);
      socket.username = username;
      socket.emit('registration-success', { user, message: 'Successfully registered!' });
      
      // Broadcast to all clients that a user joined
      socket.broadcast.emit('user-joined', { username, userId: user._id });
      
      console.log(`👤 User registered: ${username} (${socket.id})`);
    } catch (error) {
      socket.emit('registration-error', { message: error.message });
      console.error(`❌ Registration failed for ${username}:`, error.message);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', async () => {
    if (socket.username) {
      try {
        await handleUserDisconnection(socket.username);
        
        // Broadcast to all clients that a user left
        socket.broadcast.emit('user-left', { username: socket.username });
        
        console.log(`👋 User disconnected and removed: ${socket.username} (${socket.id})`);
      } catch (error) {
        console.error(`❌ Error handling disconnect for ${socket.username}:`, error.message);
      }
    } else {
      console.log(`🔌 Anonymous user disconnected: ${socket.id}`);
    }
  });

  // Handle manual logout
  socket.on('logout', async () => {
    if (socket.username) {
      try {
        await handleUserDisconnection(socket.username);
        socket.broadcast.emit('user-left', { username: socket.username });
        socket.emit('logout-success', { message: 'Successfully logged out!' });
        
        console.log(`🚪 User logged out: ${socket.username} (${socket.id})`);
        socket.username = null;
      } catch (error) {
        socket.emit('logout-error', { message: error.message });
        console.error(`❌ Logout failed for ${socket.username}:`, error.message);
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Battleship server is running!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Battleship server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🎮 Frontend should connect to: http://localhost:${PORT}`);
});

export default app;
