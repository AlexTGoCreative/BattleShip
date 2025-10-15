import { createDashboard, createAIDifficultyModal } from '../dom_module/dashboard.js';
import changeScreen from '../helper_module/change-screen.js';
import userManager from './userManager.js';
import socketService from './socketService.js';

/**
 * Dashboard Manager - Handles the main dashboard functionality
 */
class DashboardManager {
  constructor() {
    this.dashboard = null;
    this.difficultyModal = null;
    this.isInitialized = false;
    this.onlineUsers = [];
  }

  /**
   * Initialize the dashboard
   */
  init() {
    if (this.isInitialized) return;

    const currentUser = userManager.getCurrentUser();
    if (!currentUser) {
      console.error('❌ Cannot initialize dashboard without logged in user');
      return;
    }

    console.log('🎮 Initializing dashboard for user:', currentUser.username);
    
    // Create dashboard elements
    this.dashboard = createDashboard(currentUser.username);
    this.difficultyModal = createAIDifficultyModal();
    
    // Setup event listeners
    this.setupDashboardEventListeners();
    this.setupDifficultyModalEventListeners();
    this.setupSocketEventListeners();
    
    // Load initial data
    this.loadOnlineUsers();
    
    this.isInitialized = true;
    console.log('✅ Dashboard initialized successfully');
  }

  /**
   * Show the dashboard
   */
  show() {
    console.log('🎮 Dashboard show() called, isInitialized:', this.isInitialized);
    
    if (!this.isInitialized) {
      console.log('🔄 Initializing dashboard...');
      this.init();
    }

    if (this.dashboard) {
      console.log('✅ Dashboard elements found, showing...');
      // Clear any existing content and show dashboard
      const body = document.body;
      body.innerHTML = '';
      body.appendChild(this.dashboard.dashboardContainer);
      
      // Add difficulty modal to body
      if (!document.body.contains(this.difficultyModal.modal)) {
        body.appendChild(this.difficultyModal.modal);
      }
      
      console.log('📱 Dashboard shown successfully!');
    } else {
      console.error('❌ Dashboard elements not found!');
    }
  }

  /**
   * Setup dashboard event listeners
   */
  setupDashboardEventListeners() {
    if (!this.dashboard) return;

    // AI Battle Card - Show difficulty selection
    this.dashboard.aiBattleCard.addEventListener('click', () => {
      console.log('🤖 AI Battle selected');
      this.showAIDifficultyModal();
    });

    // Online Battle Card - Show online players or find match
    this.dashboard.onlineBattleCard.addEventListener('click', () => {
      console.log('🌐 Online Battle selected');
      this.handleOnlineBattleClick();
    });

    // Tutorial Card - Start tutorial
    this.dashboard.tutorialCard.addEventListener('click', () => {
      console.log('📚 Tutorial selected');
      this.startTutorial();
    });

    // Logout Button
    this.dashboard.logoutBtn.addEventListener('click', () => {
      console.log('👋 Logout clicked');
      this.handleLogout();
    });

    // Settings Button
    this.dashboard.settingsBtn.addEventListener('click', () => {
      console.log('⚙️ Settings clicked');
      this.handleSettings();
    });
  }

  /**
   * Setup difficulty modal event listeners
   */
  setupDifficultyModalEventListeners() {
    if (!this.difficultyModal) return;

    // Close button
    this.difficultyModal.closeBtn.addEventListener('click', () => {
      this.closeDifficultyModal();
    });

    // Cancel button
    this.difficultyModal.cancelBtn.addEventListener('click', () => {
      this.closeDifficultyModal();
    });

    // Easy AI option
    this.difficultyModal.easyOption.addEventListener('click', () => {
      this.startAIGame('easy');
    });

    // Hard AI option
    this.difficultyModal.hardOption.addEventListener('click', () => {
      this.startAIGame('hard');
    });

    // Close modal when clicking outside
    this.difficultyModal.modal.addEventListener('click', (e) => {
      if (e.target === this.difficultyModal.modal) {
        this.closeDifficultyModal();
      }
    });
  }

  /**
   * Setup socket event listeners
   */
  setupSocketEventListeners() {
    // Listen for online users updates
    socketService.on('users-list-updated', (data) => {
      this.updateOnlineUsers(data.users);
    });

    socketService.on('user-joined', (data) => {
      this.addOnlineUser(data.user);
    });

    socketService.on('user-left', (data) => {
      this.removeOnlineUser(data.username);
    });
  }

  /**
   * Show AI difficulty selection modal
   */
  showAIDifficultyModal() {
    if (this.difficultyModal && this.difficultyModal.modal) {
      this.difficultyModal.modal.showModal();
      console.log('🎯 AI difficulty modal shown');
    }
  }

  /**
   * Close AI difficulty modal
   */
  closeDifficultyModal() {
    if (this.difficultyModal && this.difficultyModal.modal) {
      this.difficultyModal.modal.close();
      console.log('❌ AI difficulty modal closed');
    }
  }

  /**
   * Start AI game with selected difficulty
   * @param {string} difficulty - 'easy' or 'hard'
   */
  startAIGame(difficulty) {
    console.log(`🎮 Starting AI game with ${difficulty} difficulty`);
    this.closeDifficultyModal();
    
    // Store the AI difficulty for the game
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.aiDifficulty = difficulty;
    window.gameSettings.gameMode = 'ai';
    
    // Trigger the game setup - for now, we'll emit a custom event
    // that the main app can listen to
    window.dispatchEvent(new CustomEvent('startAIGame', { 
      detail: { difficulty } 
    }));
  }

  /**
   * Handle online battle click
   */
  handleOnlineBattleClick() {
    if (this.onlineUsers.length === 0) {
      this.showMessage('No players online. Try AI battle instead!', 'info');
      return;
    }
    
    // TODO: Implement matchmaking or player selection
    console.log('🌐 Online battle functionality coming soon...');
    this.showMessage('Online multiplayer coming soon! Try AI battle for now.', 'info');
  }

  /**
   * Start tutorial
   */
  startTutorial() {
    console.log('📚 Starting tutorial');
    // Trigger tutorial - emit custom event
    window.dispatchEvent(new CustomEvent('startTutorial'));
  }

  /**
   * Handle logout
   */
  handleLogout() {
    console.log('👋 Logging out user');
    
    // Show confirmation
    if (confirm('Are you sure you want to logout?')) {
      userManager.logout();
      // Trigger logout - emit custom event
      window.dispatchEvent(new CustomEvent('userLogout'));
    }
  }

  /**
   * Handle settings
   */
  handleSettings() {
    console.log('⚙️ Opening settings');
    // Trigger settings - emit custom event
    window.dispatchEvent(new CustomEvent('openSettings'));
  }

  /**
   * Load online users from server
   */
  async loadOnlineUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/users/online');
      const data = await response.json();
      
      if (data.success) {
        this.updateOnlineUsers(data.users);
      }
    } catch (error) {
      console.warn('Could not load online users:', error);
      this.updateOnlineUsers([]);
    }
  }

  /**
   * Update online users list
   * @param {Array} users - Array of user objects
   */
  updateOnlineUsers(users) {
    if (!this.dashboard) return;

    this.onlineUsers = users.filter(user => 
      user.username !== userManager.getCurrentUser()?.username
    );

    const { playersList, playersCount } = this.dashboard;
    const count = this.onlineUsers.length;

    // Update count
    playersCount.textContent = count === 0 ? 'No other players online' : 
                              count === 1 ? '1 player online' : 
                              `${count} players online`;

    // Update online count in the card
    const onlineCountElement = this.dashboard.onlineBattleCard.querySelector('.online-count');
    if (onlineCountElement) {
      onlineCountElement.textContent = count === 0 ? 'No players online' : 
                                      count === 1 ? '1 player online' : 
                                      `${count} players online`;
    }

    // Clear and rebuild players list
    playersList.innerHTML = '';

    if (count === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-players-message';
      emptyMessage.innerHTML = `
        <div class="empty-icon">👥</div>
        <p class="empty-text">No other players online</p>
        <p class="empty-subtext">Be the first to invite friends!</p>
      `;
      playersList.appendChild(emptyMessage);
    } else {
      this.onlineUsers.forEach(user => {
        this.createPlayerCard(user, playersList);
      });
    }

    console.log(`👥 Updated online users: ${count} players`);
  }

  /**
   * Add a single user to online list
   * @param {Object} user - User object
   */
  addOnlineUser(user) {
    // Don't add the current user
    if (user.username === userManager.getCurrentUser()?.username) return;

    const existingUser = this.onlineUsers.find(u => u.username === user.username);
    if (!existingUser) {
      this.onlineUsers.push(user);
      this.updateOnlineUsers(this.onlineUsers);
    }
  }

  /**
   * Remove a user from online list
   * @param {string} username - Username to remove
   */
  removeOnlineUser(username) {
    this.onlineUsers = this.onlineUsers.filter(user => user.username !== username);
    this.updateOnlineUsers(this.onlineUsers);
  }

  /**
   * Create a player card element
   * @param {Object} user - User object
   * @param {HTMLElement} container - Container to append to
   */
  createPlayerCard(user, container) {
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    
    const avatar = document.createElement('div');
    avatar.className = 'player-avatar';
    avatar.textContent = user.username.charAt(0).toUpperCase();
    
    const playerInfo = document.createElement('div');
    playerInfo.className = 'player-info';
    
    const playerName = document.createElement('h4');
    playerName.className = 'player-name';
    playerName.textContent = user.username;
    
    const playerStatus = document.createElement('p');
    playerStatus.className = 'player-status';
    playerStatus.textContent = 'Available';
    
    playerInfo.appendChild(playerName);
    playerInfo.appendChild(playerStatus);
    
    playerCard.appendChild(avatar);
    playerCard.appendChild(playerInfo);
    
    // Add click handler for potential challenges
    playerCard.addEventListener('click', () => {
      console.log(`🎯 Clicked on player: ${user.username}`);
      this.showMessage('Player challenges coming soon!', 'info');
    });
    
    container.appendChild(playerCard);
  }

  /**
   * Show a temporary message
   * @param {string} message - Message to show
   * @param {string} type - Message type ('info', 'success', 'error')
   */
  showMessage(message, type = 'info') {
    // Create a temporary toast message
    const toast = document.createElement('div');
    toast.className = `dashboard-toast toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                   type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 
                   'rgba(59, 130, 246, 0.9)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
      font-weight: 500;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Cleanup dashboard resources
   */
  destroy() {
    if (this.difficultyModal && this.difficultyModal.modal && document.body.contains(this.difficultyModal.modal)) {
      document.body.removeChild(this.difficultyModal.modal);
    }
    
    this.dashboard = null;
    this.difficultyModal = null;
    this.isInitialized = false;
    this.onlineUsers = [];
    
    console.log('🧹 Dashboard cleanup completed');
  }
}

// Create singleton instance
const dashboardManager = new DashboardManager();

// Add toast animations to head if not present
if (!document.getElementById('dashboard-toast-styles')) {
  const style = document.createElement('style');
  style.id = 'dashboard-toast-styles';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export default dashboardManager;
