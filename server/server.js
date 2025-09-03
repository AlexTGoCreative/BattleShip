import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

// Suppress deprecation warning for util._extend
process.noDeprecation = true;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  socketId: { type: String, required: true },
  isOnline: { type: Boolean, default: true },
  currentGameId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24 hours
});

const User = mongoose.model('User', userSchema);

// Game Schema
const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  player1: { type: String, required: true }, // username
  player2: { type: String, default: null },
  status: { type: String, enum: ['waiting', 'setup', 'playing', 'finished'], default: 'waiting' },
  currentTurn: { type: String, default: null },
  winner: { type: String, default: null },
  player1Ready: { type: Boolean, default: false },
  player2Ready: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 7200 } // Auto-delete after 2 hours
});

const Game = mongoose.model('Game', gameSchema);

// Invitation Schema
const invitationSchema = new mongoose.Schema({
  inviteId: { type: String, required: true, unique: true },
  fromUser: { type: String, required: true },
  toUser: { type: String, required: true },
  gameId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'expired'], default: 'pending' },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-delete after 5 minutes
});

const Invitation = mongoose.model('Invitation', invitationSchema);

// Store connected users
const connectedUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // User registration
  socket.on('register', async (data) => {
    try {
      const { username } = data;
      
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        socket.emit('register_error', { message: 'Username already taken' });
        return;
      }

      // Create new user
      const user = new User({
        username,
        socketId: socket.id,
        isOnline: true
      });

      await user.save();
      connectedUsers.set(socket.id, username);

      socket.emit('register_success', { username });
      
      // Broadcast updated online users list
      const onlineUsers = await User.find({ isOnline: true }).select('username');
      io.emit('users_update', { users: onlineUsers.map(u => u.username) });
      
      console.log(`✅ User registered: ${username}`);
    } catch (error) {
      console.error('Registration error:', error);
      socket.emit('register_error', { message: 'Registration failed' });
    }
  });

  // Get online users
  socket.on('get_online_users', async () => {
    try {
      const onlineUsers = await User.find({ isOnline: true }).select('username');
      socket.emit('online_users', { users: onlineUsers.map(u => u.username) });
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  });

  // Send game invitation
  socket.on('send_invitation', async (data) => {
    try {
      const { toUsername } = data;
      const fromUsername = connectedUsers.get(socket.id);
      
      if (!fromUsername) {
        socket.emit('invitation_error', { message: 'You must be logged in' });
        return;
      }

      if (fromUsername === toUsername) {
        socket.emit('invitation_error', { message: 'Cannot invite yourself' });
        return;
      }

      const toUser = await User.findOne({ username: toUsername, isOnline: true });
      if (!toUser) {
        socket.emit('invitation_error', { message: 'User not found or offline' });
        return;
      }

      // Check for existing pending invitation
      const existingInvite = await Invitation.findOne({
        fromUser: fromUsername,
        toUser: toUsername,
        status: 'pending'
      });

      if (existingInvite) {
        socket.emit('invitation_error', { message: 'Invitation already sent' });
        return;
      }

      // Create game
      const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const game = new Game({
        gameId,
        player1: fromUsername,
        status: 'waiting'
      });
      await game.save();

      // Create invitation
      const inviteId = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const invitation = new Invitation({
        inviteId,
        fromUser: fromUsername,
        toUser: toUsername,
        gameId,
        status: 'pending'
      });
      await invitation.save();

      // Send invitation to target user
      const targetSocket = io.sockets.sockets.get(toUser.socketId);
      if (targetSocket) {
        targetSocket.emit('invitation_received', {
          inviteId,
          fromUser: fromUsername,
          gameId
        });
      }

      socket.emit('invitation_sent', { toUser: toUsername });
      console.log(`📧 Invitation sent from ${fromUsername} to ${toUsername}`);
    } catch (error) {
      console.error('Invitation error:', error);
      socket.emit('invitation_error', { message: 'Failed to send invitation' });
    }
  });

  // Respond to invitation
  socket.on('respond_invitation', async (data) => {
    try {
      const { inviteId, response } = data; // response: 'accept' or 'decline'
      const username = connectedUsers.get(socket.id);

      const invitation = await Invitation.findOne({ inviteId, toUser: username });
      if (!invitation) {
        socket.emit('invitation_error', { message: 'Invitation not found' });
        return;
      }

      if (response === 'accept') {
        // Update invitation status
        invitation.status = 'accepted';
        await invitation.save();

        // Update game with player2
        const game = await Game.findOne({ gameId: invitation.gameId });
        if (game) {
          game.player2 = username;
          game.status = 'setup';
          await game.save();

          // Update both users' current game
          await User.updateOne({ username: invitation.fromUser }, { currentGameId: invitation.gameId });
          await User.updateOne({ username: username }, { currentGameId: invitation.gameId });

          // Notify both players
          const fromUser = await User.findOne({ username: invitation.fromUser });
          const fromSocket = io.sockets.sockets.get(fromUser.socketId);
          
          if (fromSocket) {
            fromSocket.emit('game_start', { 
              gameId: invitation.gameId, 
              opponent: username,
              isPlayer1: true 
            });
          }
          
          socket.emit('game_start', { 
            gameId: invitation.gameId, 
            opponent: invitation.fromUser,
            isPlayer1: false 
          });

          console.log(`🎮 Game started: ${invitation.gameId}`);
        }
      } else {
        // Decline invitation
        invitation.status = 'declined';
        await invitation.save();

        // Notify sender
        const fromUser = await User.findOne({ username: invitation.fromUser });
        if (fromUser) {
          const fromSocket = io.sockets.sockets.get(fromUser.socketId);
          if (fromSocket) {
            fromSocket.emit('invitation_declined', { byUser: username });
          }
        }
      }
    } catch (error) {
      console.error('Response invitation error:', error);
      socket.emit('invitation_error', { message: 'Failed to respond to invitation' });
    }
  });

  // Join game room
  socket.on('join_game', async (data) => {
    try {
      const { gameId } = data;
      const username = connectedUsers.get(socket.id);

      const game = await Game.findOne({ gameId });
      if (!game || (game.player1 !== username && game.player2 !== username)) {
        socket.emit('game_error', { message: 'Game not found or unauthorized' });
        return;
      }

      socket.join(gameId);
      socket.emit('joined_game', { gameId });
      console.log(`🎯 ${username} joined game ${gameId}`);
    } catch (error) {
      console.error('Join game error:', error);
      socket.emit('game_error', { message: 'Failed to join game' });
    }
  });

  // Player ready for game
  socket.on('player_ready', async (data) => {
    try {
      const { gameId } = data;
      const username = connectedUsers.get(socket.id);

      const game = await Game.findOne({ gameId });
      if (!game) {
        socket.emit('game_error', { message: 'Game not found' });
        return;
      }

      // Update player ready status
      if (game.player1 === username) {
        game.player1Ready = true;
      } else if (game.player2 === username) {
        game.player2Ready = true;
      }

      await game.save();

      // Check if both players are ready
      if (game.player1Ready && game.player2Ready) {
        game.status = 'playing';
        game.currentTurn = game.player1; // Player 1 starts
        await game.save();

        io.to(gameId).emit('game_ready', { 
          currentTurn: game.currentTurn,
          player1: game.player1,
          player2: game.player2 
        });
      } else {
        io.to(gameId).emit('player_ready_update', { 
          player1Ready: game.player1Ready,
          player2Ready: game.player2Ready 
        });
      }
    } catch (error) {
      console.error('Player ready error:', error);
      socket.emit('game_error', { message: 'Failed to set ready status' });
    }
  });

  // Game move
  socket.on('game_move', async (data) => {
    try {
      const { gameId, move } = data;
      const username = connectedUsers.get(socket.id);

      const game = await Game.findOne({ gameId });
      if (!game || game.currentTurn !== username) {
        socket.emit('game_error', { message: 'Not your turn' });
        return;
      }

      // Switch turn
      game.currentTurn = game.currentTurn === game.player1 ? game.player2 : game.player1;
      await game.save();

      // Broadcast move to both players
      io.to(gameId).emit('move_made', { 
        move, 
        byPlayer: username, 
        nextTurn: game.currentTurn 
      });
    } catch (error) {
      console.error('Game move error:', error);
      socket.emit('game_error', { message: 'Failed to make move' });
    }
  });

  // Game over
  socket.on('game_over', async (data) => {
    try {
      const { gameId, winner } = data;
      
      const game = await Game.findOne({ gameId });
      if (game) {
        game.status = 'finished';
        game.winner = winner;
        await game.save();

        io.to(gameId).emit('game_finished', { winner });
        
        // Clear current game from users
        await User.updateMany(
          { currentGameId: gameId },
          { currentGameId: null }
        );
      }
    } catch (error) {
      console.error('Game over error:', error);
    }
  });

  // Disconnect handling
  socket.on('disconnect', async () => {
    try {
      const username = connectedUsers.get(socket.id);
      if (username) {
        // Mark user as offline and remove from database
        await User.deleteOne({ username });
        connectedUsers.delete(socket.id);

        // Cancel any pending invitations
        await Invitation.updateMany(
          { $or: [{ fromUser: username }, { toUser: username }], status: 'pending' },
          { status: 'expired' }
        );

        // Handle ongoing games
        const game = await Game.findOne({
          $or: [{ player1: username }, { player2: username }],
          status: { $in: ['waiting', 'setup', 'playing'] }
        });

        if (game) {
          const opponent = game.player1 === username ? game.player2 : game.player1;
          if (opponent) {
            const opponentUser = await User.findOne({ username: opponent });
            if (opponentUser) {
              const opponentSocket = io.sockets.sockets.get(opponentUser.socketId);
              if (opponentSocket) {
                opponentSocket.emit('opponent_disconnected');
              }
            }
          }
          
          // Mark game as finished
          game.status = 'finished';
          await game.save();
        }

        // Broadcast updated online users list
        const onlineUsers = await User.find({ isOnline: true }).select('username');
        io.emit('users_update', { users: onlineUsers.map(u => u.username) });

        console.log(`🔌 User disconnected: ${username}`);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
});

// Serve the main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎮 Battleship Multiplayer ready!`);
});
