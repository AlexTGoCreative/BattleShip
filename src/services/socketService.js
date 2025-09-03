import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.currentUser = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  /**
   * Initialize socket connection
   */
  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    try {
      this.socket = io('http://localhost:3000', {
        autoConnect: true,
        timeout: 5000,
        transports: ['websocket', 'polling']
      });

      this.setupEventListeners();
      return this.socket;
    } catch (error) {
      console.error('❌ Failed to connect to server:', error);
      throw new Error('Could not connect to game server. Please try again.');
    }
  }

  /**
   * Setup default socket event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Connected to server:', this.socket.id);
      this.emit('socket-connected');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('🔌 Disconnected from server:', reason);
      this.emit('socket-disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      this.emit('connection-error', error);
    });

    // User registration events
    this.socket.on('registration-success', (data) => {
      this.currentUser = data.user;
      console.log('✅ Registration successful:', data);
      this.emit('registration-success', data);
    });

    this.socket.on('registration-error', (data) => {
      console.error('❌ Registration failed:', data.message);
      this.emit('registration-error', data);
    });

    // User events
    this.socket.on('user-joined', (data) => {
      console.log('👤 User joined:', data.username);
      this.emit('user-joined', data);
    });

    this.socket.on('user-left', (data) => {
      console.log('👋 User left:', data.username);
      this.emit('user-left', data);
    });

    // Logout events
    this.socket.on('logout-success', (data) => {
      this.currentUser = null;
      console.log('🚪 Logout successful:', data.message);
      this.emit('logout-success', data);
    });

    this.socket.on('logout-error', (data) => {
      console.error('❌ Logout failed:', data.message);
      this.emit('logout-error', data);
    });
  }

  /**
   * Register a new user
   * @param {string} username - The username to register
   */
  registerUser(username) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Not connected to server. Please refresh and try again.');
    }

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      throw new Error('Please enter a valid username.');
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 2 || trimmedUsername.length > 20) {
      throw new Error('Username must be between 2 and 20 characters.');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      throw new Error('Username can only contain letters, numbers, underscores, and hyphens.');
    }

    console.log('📝 Registering user:', trimmedUsername);
    this.socket.emit('register-user', trimmedUsername);
  }

  /**
   * Logout current user
   */
  logout() {
    if (!this.socket || !this.currentUser) {
      return;
    }

    console.log('🚪 Logging out user:', this.currentUser.username);
    this.socket.emit('logout');
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentUser = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit custom event to listeners
   * @param {string} event - Event name
   * @param {*} data - Data to pass to listeners
   */
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

  /**
   * Get current user
   * @returns {Object|null} Current user object or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is registered
   * @returns {boolean} True if user is registered
   */
  isUserRegistered() {
    return this.currentUser !== null;
  }

  /**
   * Check if connected to server
   * @returns {boolean} True if connected
   */
  isSocketConnected() {
    return this.isConnected && this.socket && this.socket.connected;
  }

  /**
   * Get socket ID
   * @returns {string|null} Socket ID or null
   */
  getSocketId() {
    return this.socket ? this.socket.id : null;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
