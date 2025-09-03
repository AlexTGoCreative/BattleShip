import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentUser = null;
    this.currentGameId = null;
    this.listeners = new Map();
  }

  connect() {
    const serverUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:3000';
    
    this.socket = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5
    });

    this.setupEventListeners();
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('🔌 Connected to server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        reject(error);
      });
    });
  }

  setupEventListeners() {
    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('🔌 Disconnected from server');
      this.emit('disconnected');
    });

    this.socket.on('reconnect', () => {
      this.isConnected = true;
      console.log('🔌 Reconnected to server');
      this.emit('reconnected');
    });

    // User management events
    this.socket.on('register_success', (data) => {
      this.currentUser = data.username;
      this.emit('register_success', data);
    });

    this.socket.on('register_error', (data) => {
      this.emit('register_error', data);
    });

    this.socket.on('users_update', (data) => {
      this.emit('users_update', data);
    });

    this.socket.on('online_users', (data) => {
      this.emit('online_users', data);
    });

    // Invitation events
    this.socket.on('invitation_received', (data) => {
      this.emit('invitation_received', data);
    });

    this.socket.on('invitation_sent', (data) => {
      this.emit('invitation_sent', data);
    });

    this.socket.on('invitation_declined', (data) => {
      this.emit('invitation_declined', data);
    });

    this.socket.on('invitation_error', (data) => {
      this.emit('invitation_error', data);
    });

    // Game events
    this.socket.on('game_start', (data) => {
      this.currentGameId = data.gameId;
      this.emit('game_start', data);
    });

    this.socket.on('joined_game', (data) => {
      this.emit('joined_game', data);
    });

    this.socket.on('game_ready', (data) => {
      this.emit('game_ready', data);
    });

    this.socket.on('player_ready_update', (data) => {
      this.emit('player_ready_update', data);
    });

    this.socket.on('move_made', (data) => {
      this.emit('move_made', data);
    });

    this.socket.on('game_finished', (data) => {
      this.currentGameId = null;
      this.emit('game_finished', data);
    });

    this.socket.on('game_error', (data) => {
      this.emit('game_error', data);
    });

    this.socket.on('opponent_disconnected', () => {
      this.emit('opponent_disconnected');
    });
  }

  // Event emitter methods
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // User methods
  register(username) {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('register', { username });
  }

  getOnlineUsers() {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('get_online_users');
  }

  // Invitation methods
  sendInvitation(toUsername) {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('Not connected or not logged in');
    }
    this.socket.emit('send_invitation', { toUsername });
  }

  respondToInvitation(inviteId, response) {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('respond_invitation', { inviteId, response });
  }

  // Game methods
  joinGame(gameId) {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('join_game', { gameId });
  }

  setPlayerReady(gameId) {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('player_ready', { gameId });
  }

  makeGameMove(gameId, move) {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('game_move', { gameId, move });
  }

  endGame(gameId, winner) {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('game_over', { gameId, winner });
  }

  // Utility methods
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentUser = null;
      this.currentGameId = null;
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentGameId() {
    return this.currentGameId;
  }

  isUserLoggedIn() {
    return this.isConnected && this.currentUser;
  }
}

// Create singleton instance
const socketClient = new SocketClient();

export default socketClient;
