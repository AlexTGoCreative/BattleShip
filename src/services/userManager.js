import createUserRegistration from '../dom_module/user-registration.js';
import socketService from './socketService.js';

class UserManager {
  constructor() {
    this.registrationModal = null;
    this.connectionStatus = null;
    this.isInitialized = false;
    this.currentUser = null;
    this.onlineUsers = [];
    this.registrationCallbacks = [];
    this.isModalShowing = false;
  }

  /**
   * Initialize the user manager
   */
  init() {
    if (this.isInitialized) return;

    this.createRegistrationModal();
    this.createConnectionStatus();
    this.setupSocketListeners();
    this.connectToServer();
    
    this.isInitialized = true;
    console.log('👤 User Manager initialized');
  }

  /**
   * Create registration modal
   */
  createRegistrationModal() {
    this.registrationModal = createUserRegistration();
    this.setupRegistrationListeners();
  }

  /**
   * Create connection status indicator
   */
  createConnectionStatus() {
    this.connectionStatus = document.createElement('div');
    this.connectionStatus.className = 'connection-status connecting';
    this.connectionStatus.textContent = 'connecting...';
    document.body.appendChild(this.connectionStatus);
  }

  /**
   * Setup registration modal event listeners
   */
  setupRegistrationListeners() {
    const { form, usernameInput, cancelButton, errorMessage, successMessage } = this.registrationModal;

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegistration();
    });

    // Cancel button
    cancelButton.addEventListener('click', () => {
      this.closeRegistrationModal();
    });

    // Input validation on typing
    usernameInput.addEventListener('input', (e) => {
      this.validateUsername(e.target.value);
      this.hideMessages();
    });

    // Enter key handling
    usernameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleRegistration();
      }
    });
  }

  /**
   * Setup socket event listeners
   */
  setupSocketListeners() {
    socketService.on('socket-connected', () => {
      this.updateConnectionStatus('connected', 'connected');
      // Don't automatically show modal on connection
      // It will be shown when user tries to access a feature that requires registration
    });

    socketService.on('socket-disconnected', (reason) => {
      this.updateConnectionStatus('disconnected', 'disconnected');
      this.currentUser = null;
      console.log('🔌 Disconnected:', reason);
    });

    socketService.on('connection-error', (error) => {
      this.updateConnectionStatus('disconnected', 'connection failed');
      console.error('Socket connection error:', error);
      console.log('💡 To start the backend server, run: npm run server');
      
      // Still show registration modal even if server is not running
      // The modal will show connection error
      if (this.registrationCallbacks.length > 0) {
        this.showRegistrationModal();
        this.showError('Cannot connect to server. Start backend with: npm run server');
      }
    });

    socketService.on('registration-success', (data) => {
      this.currentUser = data.user;
      this.showSuccess(`Welcome, ${data.user.username}!`);
      
      // Close modal after a delay to show success message
      setTimeout(() => {
        this.closeRegistrationModal();
      }, 2000);
    });

    socketService.on('registration-error', (data) => {
      this.showError(data.message);
      this.enableRegistrationForm();
    });

    socketService.on('user-joined', (data) => {
      this.addOnlineUser(data.username);
    });

    socketService.on('user-left', (data) => {
      this.removeOnlineUser(data.username);
    });
  }

  /**
   * Connect to server
   */
  connectToServer() {
    try {
      this.updateConnectionStatus('connecting', 'connecting...');
      socketService.connect();
    } catch (error) {
      this.updateConnectionStatus('disconnected', 'connection failed');
      this.showError(error.message);
    }
  }

  /**
   * Show registration modal
   */
  showRegistrationModal() {
    console.log('🔄 Attempting to show registration modal...', {
      hasModal: !!this.registrationModal,
      hasUser: !!this.currentUser,
      isShowing: this.isModalShowing
    });

    if (!this.registrationModal) {
      console.error('❌ Registration modal not created yet');
      return;
    }

    if (this.currentUser) {
      console.log('✅ User already registered:', this.currentUser.username);
      return;
    }

    if (this.isModalShowing) {
      console.log('⚠️ Modal already showing');
      return;
    }

    this.isModalShowing = true;
    console.log('📱 Showing registration modal...');

    try {
      // Check if dialog is already in DOM
      if (!document.body.contains(this.registrationModal.registrationDialog)) {
        document.body.appendChild(this.registrationModal.registrationDialog);
        console.log('➕ Added modal to DOM');
      }

      // Check if dialog is already open
      if (!this.registrationModal.registrationDialog.open) {
        this.registrationModal.registrationDialog.showModal();
        console.log('✅ Modal opened successfully');
      } else {
        console.log('⚠️ Modal was already open');
      }
      
      // Focus on input and load users
      setTimeout(() => {
        if (this.registrationModal.usernameInput) {
          this.registrationModal.usernameInput.focus();
        }
        this.loadOnlineUsers();
      }, 100);

    } catch (error) {
      console.error('❌ Error showing modal:', error);
      this.isModalShowing = false;
    }
  }

  /**
   * Close registration modal
   */
  closeRegistrationModal() {
    if (!this.registrationModal) return;

    this.isModalShowing = false;

    try {
      this.registrationModal.registrationDialog.close();
      if (document.body.contains(this.registrationModal.registrationDialog)) {
        document.body.removeChild(this.registrationModal.registrationDialog);
      }
      
      // Execute any pending callbacks
      this.registrationCallbacks.forEach(callback => callback());
      this.registrationCallbacks = [];
    } catch (error) {
      console.warn('Error closing registration modal:', error);
    }
  }

  /**
   * Handle registration form submission
   */
  handleRegistration() {
    const username = this.registrationModal.usernameInput.value.trim();
    
    if (!this.validateUsername(username)) {
      return;
    }

    this.hideMessages();
    this.disableRegistrationForm();

    try {
      socketService.registerUser(username);
    } catch (error) {
      this.showError(error.message);
      this.enableRegistrationForm();
    }
  }

  /**
   * Validate username
   * @param {string} username - Username to validate
   * @returns {boolean} True if valid
   */
  validateUsername(username) {
    if (!username || username.length === 0) {
      return false;
    }

    if (username.length < 2) {
      this.showError('Username must be at least 2 characters long');
      return false;
    }

    if (username.length > 20) {
      this.showError('Username must not exceed 20 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      this.showError('Username can only contain letters, numbers, underscores, and hyphens');
      return false;
    }

    return true;
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    if (!this.registrationModal) return;

    this.hideMessages();
    this.registrationModal.errorMessage.textContent = message;
    this.registrationModal.errorMessage.classList.remove('hidden');
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    if (!this.registrationModal) return;

    this.hideMessages();
    this.registrationModal.successMessage.textContent = message;
    this.registrationModal.successMessage.classList.remove('hidden');
  }

  /**
   * Hide all messages
   */
  hideMessages() {
    if (!this.registrationModal) return;

    this.registrationModal.errorMessage.classList.add('hidden');
    this.registrationModal.successMessage.classList.add('hidden');
  }

  /**
   * Disable registration form
   */
  disableRegistrationForm() {
    if (!this.registrationModal) return;

    this.registrationModal.usernameInput.disabled = true;
    this.registrationModal.joinButton.disabled = true;
    this.registrationModal.joinButton.textContent = 'Joining...';
  }

  /**
   * Enable registration form
   */
  enableRegistrationForm() {
    if (!this.registrationModal) return;

    this.registrationModal.usernameInput.disabled = false;
    this.registrationModal.joinButton.disabled = false;
    this.registrationModal.joinButton.textContent = 'Join Game';
  }

  /**
   * Update connection status
   * @param {string} status - Status class
   * @param {string} text - Status text
   */
  updateConnectionStatus(status, text) {
    if (!this.connectionStatus) return;

    this.connectionStatus.className = `connection-status ${status}`;
    this.connectionStatus.textContent = text;

    // Auto-hide after 3 seconds if connected
    if (status === 'connected') {
      setTimeout(() => {
        if (this.connectionStatus) {
          this.connectionStatus.style.opacity = '0';
          setTimeout(() => {
            if (this.connectionStatus && this.connectionStatus.style.opacity === '0') {
              this.connectionStatus.style.display = 'none';
            }
          }, 300);
        }
      }, 3000);
    } else {
      this.connectionStatus.style.opacity = '1';
      this.connectionStatus.style.display = 'block';
    }
  }

  /**
   * Load online users from server
   */
  async loadOnlineUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/users/online');
      const data = await response.json();
      
      if (data.success) {
        this.updateOnlineUsersList(data.users);
      }
    } catch (error) {
      console.warn('Could not load online users:', error);
    }
  }

  /**
   * Update online users list
   * @param {Array} users - Array of user objects
   */
  updateOnlineUsersList(users) {
    if (!this.registrationModal) return;

    this.onlineUsers = users;
    const { onlineUsersList, onlineUsersHeader } = this.registrationModal;

    onlineUsersList.innerHTML = '';
    onlineUsersHeader.textContent = `Players Online (${users.length})`;

    if (users.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'online-users-empty';
      emptyMessage.textContent = 'No players online';
      onlineUsersList.appendChild(emptyMessage);
    } else {
      users.forEach(user => {
        const userTag = document.createElement('div');
        userTag.className = 'online-user-tag';
        userTag.textContent = user.username;
        onlineUsersList.appendChild(userTag);
      });
    }
  }

  /**
   * Add user to online list
   * @param {string} username - Username to add
   */
  addOnlineUser(username) {
    const existingUser = this.onlineUsers.find(user => user.username === username);
    if (!existingUser) {
      this.onlineUsers.push({ username });
      this.updateOnlineUsersList(this.onlineUsers);
    }
  }

  /**
   * Remove user from online list
   * @param {string} username - Username to remove
   */
  removeOnlineUser(username) {
    this.onlineUsers = this.onlineUsers.filter(user => user.username !== username);
    this.updateOnlineUsersList(this.onlineUsers);
  }

  /**
   * Get current user
   * @returns {Object|null} Current user object
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
   * Require user registration before executing callback
   * @param {Function} callback - Function to execute after registration
   */
  requireRegistration(callback) {
    if (this.isUserRegistered()) {
      callback();
    } else {
      this.registrationCallbacks.push(callback);
      
      // Wait a bit to ensure socket is connected before showing modal
      if (socketService.isSocketConnected()) {
        this.showRegistrationModal();
      } else {
        // If not connected, wait for connection
        const waitForConnection = () => {
          if (socketService.isSocketConnected()) {
            this.showRegistrationModal();
          } else {
            setTimeout(waitForConnection, 100);
          }
        };
        waitForConnection();
      }
    }
  }

  /**
   * Logout current user
   */
  logout() {
    socketService.logout();
    this.currentUser = null;
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.closeRegistrationModal();
    
    if (this.connectionStatus && document.body.contains(this.connectionStatus)) {
      document.body.removeChild(this.connectionStatus);
    }

    socketService.disconnect();
    this.isInitialized = false;
  }
}

// Create singleton instance
const userManager = new UserManager();

export default userManager;