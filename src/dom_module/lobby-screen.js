import createElementWithClass from '../helper_module/create-element-with-class.js';
import createAIDifficultyModal from './ai-difficulty-modal.js';
import socketClient from '../services/socket-client.js';

export default function createLobbyScreen(currentUser) {
  const lobbyContainer = createElementWithClass('div', [
    'lobby-screen',
    'full-height',
    'd-flex__col',
    'animated-bg'
  ]);

  // Header
  const header = createElementWithClass('header', [
    'lobby-header',
    'glass-card',
    'padding_2r',
    'margin-bottom_2r'
  ]);

  const headerContent = createElementWithClass('div', [
    'header-content',
    'd-flex',
    'justify-content__between',
    'align-items__center'
  ]);

  const userInfo = createElementWithClass('div', [
    'user-info',
    'd-flex',
    'align-items__center',
    'gap_1r'
  ]);

  const userAvatar = createElementWithClass('div', [
    'user-avatar'
  ]);
  userAvatar.textContent = currentUser.charAt(0).toUpperCase();

  const userDetails = createElementWithClass('div', [
    'user-details'
  ]);

  const userName = createElementWithClass('h3', [
    'user-name'
  ]);
  userName.textContent = currentUser;

  const userStatus = createElementWithClass('p', [
    'user-status',
    'text-muted'
  ]);
  userStatus.textContent = 'Ready to battle';

  userDetails.appendChild(userName);
  userDetails.appendChild(userStatus);

  userInfo.appendChild(userAvatar);
  userInfo.appendChild(userDetails);

  const headerActions = createElementWithClass('div', [
    'header-actions',
    'd-flex',
    'gap_1r'
  ]);

  const refreshButton = createElementWithClass('button', [
    'btn-secondary',
    'btn-icon',
    'cursor_pointer'
  ]);
  refreshButton.innerHTML = '🔄';
  refreshButton.title = 'Refresh player list';

  const logoutButton = createElementWithClass('button', [
    'btn-danger',
    'cursor_pointer'
  ]);
  logoutButton.textContent = 'Logout';

  headerActions.appendChild(refreshButton);
  headerActions.appendChild(logoutButton);

  headerContent.appendChild(userInfo);
  headerContent.appendChild(headerActions);
  header.appendChild(headerContent);

  // Main content
  const mainContent = createElementWithClass('main', [
    'lobby-main',
    'd-flex',
    'gap_2r',
    'flex-grow',
    'padding_0_2r'
  ]);

  // Game modes section
  const gameModesSection = createElementWithClass('section', [
    'game-modes-section',
    'glass-card',
    'padding_2r',
    'margin-bottom_2r'
  ]);

  const gameModesHeader = createElementWithClass('h2', [
    'section-title',
    'margin-bottom_2r'
  ]);
  gameModesHeader.textContent = 'Game Modes';

  const gameModesButtons = createElementWithClass('div', [
    'game-modes-buttons',
    'd-flex',
    'gap_1r'
  ]);

  const vsAIButton = createElementWithClass('button', [
    'btn-primary',
    'btn-lg',
    'cursor_pointer',
    'flex-grow',
    'game-mode-btn'
  ]);
  vsAIButton.innerHTML = `
    <div class="game-mode-icon">🤖</div>
    <div class="game-mode-text">
      <div class="game-mode-title">VS AI</div>
      <div class="game-mode-desc">Battle against computer</div>
    </div>
  `;

  const vsPlayerButton = createElementWithClass('button', [
    'btn-secondary',
    'btn-lg',
    'cursor_pointer',
    'flex-grow',
    'game-mode-btn'
  ]);
  vsPlayerButton.innerHTML = `
    <div class="game-mode-icon">👥</div>
    <div class="game-mode-text">
      <div class="game-mode-title">VS Player</div>
      <div class="game-mode-desc">Challenge online players</div>
    </div>
  `;

  gameModesButtons.appendChild(vsAIButton);
  gameModesButtons.appendChild(vsPlayerButton);

  gameModesSection.appendChild(gameModesHeader);
  gameModesSection.appendChild(gameModesButtons);

  // Players section
  const playersSection = createElementWithClass('section', [
    'players-section',
    'glass-card',
    'padding_2r',
    'flex-grow',
    'hidden'
  ]);

  const playersSectionHeader = createElementWithClass('div', [
    'section-header',
    'd-flex',
    'justify-content__between',
    'align-items__center',
    'margin-bottom_2r'
  ]);

  const playersTitle = createElementWithClass('h2', [
    'section-title'
  ]);
  playersTitle.textContent = 'Online Players';

  const onlineCount = createElementWithClass('span', [
    'online-count',
    'badge'
  ]);
  onlineCount.textContent = '0';

  playersSectionHeader.appendChild(playersTitle);
  playersSectionHeader.appendChild(onlineCount);

  const playersListContainer = createElementWithClass('div', [
    'players-list-container'
  ]);

  const playersList = createElementWithClass('div', [
    'players-list',
    'd-flex__col',
    'gap_1r'
  ]);

  const emptyState = createElementWithClass('div', [
    'empty-state',
    'text-align__center',
    'padding_3r'
  ]);

  const emptyIcon = createElementWithClass('div', [
    'empty-icon'
  ]);
  emptyIcon.textContent = '👥';

  const emptyText = createElementWithClass('p', [
    'empty-text',
    'text-muted'
  ]);
  emptyText.textContent = 'No other players online';

  emptyState.appendChild(emptyIcon);
  emptyState.appendChild(emptyText);

  playersListContainer.appendChild(playersList);
  playersListContainer.appendChild(emptyState);

  playersSection.appendChild(playersSectionHeader);
  playersSection.appendChild(playersListContainer);

  // Activity section
  const activitySection = createElementWithClass('section', [
    'activity-section',
    'glass-card',
    'padding_2r',
    'width-300'
  ]);

  const activityHeader = createElementWithClass('h2', [
    'section-title',
    'margin-bottom_2r'
  ]);
  activityHeader.textContent = 'Activity';

  const activityList = createElementWithClass('div', [
    'activity-list',
    'd-flex__col',
    'gap_1r'
  ]);

  const noActivity = createElementWithClass('div', [
    'no-activity',
    'text-align__center',
    'padding_2r'
  ]);

  const noActivityIcon = createElementWithClass('div', [
    'no-activity-icon'
  ]);
  noActivityIcon.textContent = '📋';

  const noActivityText = createElementWithClass('p', [
    'text-muted'
  ]);
  noActivityText.textContent = 'No recent activity';

  noActivity.appendChild(noActivityIcon);
  noActivity.appendChild(noActivityText);

  activityList.appendChild(noActivity);

  activitySection.appendChild(activityHeader);
  activitySection.appendChild(activityList);

  const gameContentWrapper = createElementWithClass('div', [
    'game-content-wrapper',
    'd-flex',
    'gap_2r',
    'flex-grow'
  ]);

  gameContentWrapper.appendChild(playersSection);
  gameContentWrapper.appendChild(activitySection);

  mainContent.appendChild(gameModesSection);
  mainContent.appendChild(gameContentWrapper);

  lobbyContainer.appendChild(header);
  lobbyContainer.appendChild(mainContent);

  // Notification system
  const notificationContainer = createElementWithClass('div', [
    'notification-container',
    'fixed-top-right'
  ]);

  lobbyContainer.appendChild(notificationContainer);

  // State management
  let onlinePlayers = [];
  let pendingInvitations = new Set();
  let currentGameMode = 'multiplayer'; // 'multiplayer' or 'ai'

  // Utility functions
  const showNotification = (message, type = 'info', duration = 4000) => {
    const notification = createElementWithClass('div', [
      'notification',
      `notification-${type}`,
      'animate-slide-in-right'
    ]);

    const notificationContent = createElementWithClass('div', [
      'notification-content',
      'd-flex',
      'justify-content__between',
      'align-items__center'
    ]);

    const messageEl = createElementWithClass('span', []);
    messageEl.textContent = message;

    const closeBtn = createElementWithClass('button', [
      'notification-close',
      'btn-icon'
    ]);
    closeBtn.innerHTML = '×';

    notificationContent.appendChild(messageEl);
    notificationContent.appendChild(closeBtn);
    notification.appendChild(notificationContent);

    closeBtn.addEventListener('click', () => {
      removeNotification(notification);
    });

    notificationContainer.appendChild(notification);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification);
      }, duration);
    }

    return notification;
  };

  const removeNotification = (notification) => {
    notification.classList.add('animate-slide-out-right');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  };

  const addActivity = (message, type = 'info') => {
    const activity = createElementWithClass('div', [
      'activity-item',
      'd-flex',
      'align-items__center',
      'gap_1r',
      'animate-fade-in'
    ]);

    const activityIcon = createElementWithClass('div', [
      'activity-icon',
      `activity-${type}`
    ]);

    const icons = {
      invitation: '📧',
      game: '🎮',
      player: '👤',
      info: 'ℹ️'
    };

    activityIcon.textContent = icons[type] || icons.info;

    const activityText = createElementWithClass('div', [
      'activity-text',
      'text-small'
    ]);
    activityText.textContent = message;

    const activityTime = createElementWithClass('div', [
      'activity-time',
      'text-tiny',
      'text-muted'
    ]);
    activityTime.textContent = new Date().toLocaleTimeString();

    activity.appendChild(activityIcon);
    activity.appendChild(activityText);
    activity.appendChild(activityTime);

    // Remove "no activity" message if present
    if (noActivity.parentNode) {
      noActivity.parentNode.removeChild(noActivity);
    }

    activityList.insertBefore(activity, activityList.firstChild);

    // Keep only last 10 activities
    while (activityList.children.length > 10) {
      activityList.removeChild(activityList.lastChild);
    }
  };

  const createPlayerCard = (username) => {
    const playerCard = createElementWithClass('div', [
      'player-card',
      'd-flex',
      'justify-content__between',
      'align-items__center',
      'padding_1r',
      'animate-fade-in'
    ]);

    const playerInfo = createElementWithClass('div', [
      'player-info',
      'd-flex',
      'align-items__center',
      'gap_1r'
    ]);

    const playerAvatar = createElementWithClass('div', [
      'player-avatar',
      'small'
    ]);
    playerAvatar.textContent = username.charAt(0).toUpperCase();

    const playerName = createElementWithClass('span', [
      'player-name'
    ]);
    playerName.textContent = username;

    const onlineIndicator = createElementWithClass('div', [
      'online-indicator'
    ]);

    playerInfo.appendChild(playerAvatar);
    playerInfo.appendChild(playerName);
    playerInfo.appendChild(onlineIndicator);

    const playerActions = createElementWithClass('div', [
      'player-actions'
    ]);

    const inviteButton = createElementWithClass('button', [
      'btn-primary',
      'btn-sm',
      'cursor_pointer'
    ]);

    if (pendingInvitations.has(username)) {
      inviteButton.textContent = 'Pending...';
      inviteButton.disabled = true;
      inviteButton.classList.add('btn-disabled');
    } else {
      inviteButton.textContent = 'Invite';
    }

    inviteButton.addEventListener('click', () => {
      if (!pendingInvitations.has(username)) {
        sendInvitation(username);
      }
    });

    playerActions.appendChild(inviteButton);
    playerCard.appendChild(playerInfo);
    playerCard.appendChild(playerActions);

    return playerCard;
  };

  const updatePlayersList = (players) => {
    onlinePlayers = players.filter(player => player !== currentUser);
    playersList.innerHTML = '';

    onlineCount.textContent = onlinePlayers.length.toString();

    if (onlinePlayers.length === 0) {
      if (!emptyState.parentNode) {
        playersListContainer.appendChild(emptyState);
      }
    } else {
      if (emptyState.parentNode) {
        emptyState.parentNode.removeChild(emptyState);
      }

      onlinePlayers.forEach(player => {
        const playerCard = createPlayerCard(player);
        playersList.appendChild(playerCard);
      });
    }
  };

  const sendInvitation = (toUsername) => {
    try {
      socketClient.sendInvitation(toUsername);
      pendingInvitations.add(toUsername);
      updatePlayersList(onlinePlayers.concat([currentUser]));
      addActivity(`Sent invitation to ${toUsername}`, 'invitation');
    } catch (error) {
      showNotification('Failed to send invitation', 'error');
    }
  };

  // Game mode switching
  const switchToGameMode = (mode) => {
    currentGameMode = mode;
    
    if (mode === 'ai') {
      vsAIButton.classList.remove('btn-secondary');
      vsAIButton.classList.add('btn-primary');
      vsPlayerButton.classList.remove('btn-primary');
      vsPlayerButton.classList.add('btn-secondary');
      
      playersSection.classList.add('hidden');
      addActivity('Switched to AI mode', 'info');
    } else {
      vsPlayerButton.classList.remove('btn-secondary');
      vsPlayerButton.classList.add('btn-primary');
      vsAIButton.classList.remove('btn-primary');
      vsAIButton.classList.add('btn-secondary');
      
      playersSection.classList.remove('hidden');
      socketClient.getOnlineUsers();
      addActivity('Switched to multiplayer mode', 'info');
    }
  };

  // Create AI difficulty modal
  const aiDifficultyModal = createAIDifficultyModal();

  // Game mode event listeners
  vsAIButton.addEventListener('click', () => {
    // Show difficulty selection modal
    switchToGameMode('ai');
    aiDifficultyModal.show();
  });

  vsPlayerButton.addEventListener('click', () => {
    switchToGameMode('multiplayer');
  });

  // Event listeners
  refreshButton.addEventListener('click', () => {
    if (currentGameMode === 'multiplayer') {
      socketClient.getOnlineUsers();
      addActivity('Refreshed player list', 'info');
    }
  });

  logoutButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      socketClient.disconnect();
      // Will be handled by main app
    }
  });

  // Socket event listeners
  socketClient.on('users_update', (data) => {
    updatePlayersList(data.users);
  });

  socketClient.on('online_users', (data) => {
    updatePlayersList(data.users);
  });

  socketClient.on('invitation_sent', (data) => {
    showNotification(`Invitation sent to ${data.toUser}`, 'success');
  });

  socketClient.on('invitation_received', (data) => {
    const notification = showNotification(
      `${data.fromUser} wants to battle!`,
      'invitation',
      0 // Don't auto-dismiss
    );

    // Add accept/decline buttons
    const notificationContent = notification.querySelector('.notification-content');
    const buttonsContainer = createElementWithClass('div', [
      'notification-buttons',
      'd-flex',
      'gap_05r'
    ]);

    const acceptBtn = createElementWithClass('button', [
      'btn-success',
      'btn-xs'
    ]);
    acceptBtn.textContent = 'Accept';

    const declineBtn = createElementWithClass('button', [
      'btn-danger',
      'btn-xs'
    ]);
    declineBtn.textContent = 'Decline';

    acceptBtn.addEventListener('click', () => {
      socketClient.respondToInvitation(data.inviteId, 'accept');
      removeNotification(notification);
      addActivity(`Accepted invitation from ${data.fromUser}`, 'game');
    });

    declineBtn.addEventListener('click', () => {
      socketClient.respondToInvitation(data.inviteId, 'decline');
      removeNotification(notification);
      addActivity(`Declined invitation from ${data.fromUser}`, 'invitation');
    });

    buttonsContainer.appendChild(acceptBtn);
    buttonsContainer.appendChild(declineBtn);
    notificationContent.appendChild(buttonsContainer);

    addActivity(`Received invitation from ${data.fromUser}`, 'invitation');
  });

  socketClient.on('invitation_declined', (data) => {
    pendingInvitations.delete(data.byUser);
    updatePlayersList(onlinePlayers.concat([currentUser]));
    showNotification(`${data.byUser} declined your invitation`, 'warning');
    addActivity(`${data.byUser} declined invitation`, 'invitation');
  });

  socketClient.on('invitation_error', (data) => {
    showNotification(data.message, 'error');
  });

  socketClient.on('game_start', () => {
    // Will be handled by main app
  });

  // Initialize
  socketClient.getOnlineUsers();
  addActivity('Joined the lobby', 'player');

  // Initialize with multiplayer mode
  switchToGameMode('multiplayer');

  return {
    lobbyContainer,
    showNotification,
    addActivity,
    vsAIButton,
    vsPlayerButton,
    switchToGameMode,
    getCurrentGameMode: () => currentGameMode
  };
}
