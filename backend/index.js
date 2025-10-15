import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import { handleUserConnection, handleUserDisconnection } from './controllers/userController.js';

// ES6 module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'https://localhost:8080',
      'https://battleship-frontend.netlify.app', // Replace with your actual Netlify URL
      process.env.FRONTEND_URL,
      process.env.SOCKET_CORS_ORIGIN
    ].filter(Boolean);

    if (process.env.NODE_ENV === 'production') {
      // In production, allow Netlify and configured URLs
      if (allowedOrigins.some(allowed => origin.includes(new URL(allowed).hostname)) || 
          allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Be more permissive for now
      }
    } else {
      // In development, be more permissive
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Battleship Backend API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    port: process.env.PORT || 3001,
    uptime: process.uptime()
  });
});

// API health endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    api: 'Battleship Backend API v1.0',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Battleship Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/health',
      users: '/api/users'
    }
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

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Battleship Backend API running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 Health check: ${process.env.NODE_ENV === 'production' ? 'https://your-backend.onrender.com' : `http://localhost:${PORT}`}/health`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`🎮 Backend API available at: https://your-backend.onrender.com`);
  } else {
    console.log(`🎮 Local backend running at: http://localhost:${PORT}`);
  }
});

export default app;