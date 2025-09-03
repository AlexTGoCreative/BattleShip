import createElementWithClass from '../helper_module/create-element-with-class.js';
import socketClient from '../services/socket-client.js';

export default function createLoginScreen() {
  const loginContainer = createElementWithClass('div', [
    'login-screen',
    'centered_flex',
    'd-flex__col',
    'text-align__center',
    'full-height',
    'animated-bg'
  ]);

  const contentWrapper = createElementWithClass('div', [
    'login-content',
    'd-flex__col',
    'centered_flex',
    'gap_2r',
    'padding_3r',
    'glass-card',
    'animate-fade-in'
  ]);

  // Header section
  const headerSection = createElementWithClass('div', [
    'login-header',
    'd-flex__col',
    'gap_1r',
    'text-align__center'
  ]);

  const gameTitle = createElementWithClass('h1', [
    'game-title',
    'text-gradient',
    'animate-slide-down'
  ]);
  gameTitle.textContent = 'Battleship';

  const gameSubtitle = createElementWithClass('p', [
    'game-subtitle',
    'text-muted',
    'animate-slide-up'
  ]);
  gameSubtitle.textContent = 'Multiplayer Naval Combat';

  const battleIcon = createElementWithClass('div', [
    'battle-icon',
    'animate-float'
  ]);
  battleIcon.innerHTML = '⚓';

  headerSection.appendChild(battleIcon);
  headerSection.appendChild(gameTitle);
  headerSection.appendChild(gameSubtitle);

  // Login form
  const loginForm = createElementWithClass('form', [
    'login-form',
    'd-flex__col',
    'gap_1r',
    'width-100'
  ]);

  const inputGroup = createElementWithClass('div', [
    'input-group',
    'd-flex__col',
    'gap_05r'
  ]);

  const usernameLabel = createElementWithClass('label', [
    'input-label',
    'text-left'
  ]);
  usernameLabel.textContent = 'Enter your username';
  usernameLabel.setAttribute('for', 'username');

  const usernameInput = createElementWithClass('input', [
    'username-input',
    'modern-input',
    'animate-scale-in'
  ]);
  usernameInput.type = 'text';
  usernameInput.id = 'username';
  usernameInput.name = 'username';
  usernameInput.placeholder = 'Choose a username...';
  usernameInput.maxLength = 20;
  usernameInput.required = true;
  usernameInput.autocomplete = 'off';

  const inputRequirements = createElementWithClass('div', [
    'input-requirements',
    'text-small',
    'text-muted'
  ]);
  inputRequirements.textContent = '3-20 characters, letters and numbers only';

  inputGroup.appendChild(usernameLabel);
  inputGroup.appendChild(usernameInput);
  inputGroup.appendChild(inputRequirements);

  const buttonGroup = createElementWithClass('div', [
    'button-group',
    'd-flex__col',
    'gap_1r',
    'width-100'
  ]);

  const joinButton = createElementWithClass('button', [
    'join-btn',
    'btn-primary',
    'btn-lg',
    'cursor_pointer',
    'animate-pulse-slow'
  ]);
  joinButton.type = 'submit';
  joinButton.textContent = 'Join Battle';

  const connectionStatus = createElementWithClass('div', [
    'connection-status',
    'd-flex',
    'align-items__center',
    'justify-content__center',
    'gap_05r',
    'text-small'
  ]);

  const statusIndicator = createElementWithClass('div', [
    'status-indicator',
    'connecting'
  ]);

  const statusText = createElementWithClass('span', [
    'status-text'
  ]);
  statusText.textContent = 'Connecting to server...';

  connectionStatus.appendChild(statusIndicator);
  connectionStatus.appendChild(statusText);

  buttonGroup.appendChild(joinButton);
  buttonGroup.appendChild(connectionStatus);

  loginForm.appendChild(inputGroup);
  loginForm.appendChild(buttonGroup);

  // Error message
  const errorMessage = createElementWithClass('div', [
    'error-message',
    'hidden',
    'animate-shake'
  ]);

  // Loading overlay
  const loadingOverlay = createElementWithClass('div', [
    'loading-overlay',
    'hidden',
    'centered_flex',
    'd-flex__col',
    'gap_1r'
  ]);

  const spinner = createElementWithClass('div', [
    'spinner'
  ]);

  const loadingText = createElementWithClass('p', [
    'loading-text'
  ]);
  loadingText.textContent = 'Joining the battle...';

  loadingOverlay.appendChild(spinner);
  loadingOverlay.appendChild(loadingText);

  // Assemble the login screen
  contentWrapper.appendChild(headerSection);
  contentWrapper.appendChild(loginForm);
  contentWrapper.appendChild(errorMessage);

  loginContainer.appendChild(contentWrapper);
  loginContainer.appendChild(loadingOverlay);

  // Event handlers
  let isSubmitting = false;

  const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.classList.add('animate-shake');
    setTimeout(() => {
      errorMessage.classList.remove('animate-shake');
    }, 500);
  };

  const hideError = () => {
    errorMessage.classList.add('hidden');
  };

  const showLoading = () => {
    loadingOverlay.classList.remove('hidden');
    joinButton.disabled = true;
  };

  const hideLoading = () => {
    loadingOverlay.classList.add('hidden');
    joinButton.disabled = false;
    isSubmitting = false;
  };

  const validateUsername = (username) => {
    const trimmed = username.trim();
    if (trimmed.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (trimmed.length > 20) {
      return 'Username must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  };

  const updateConnectionStatus = (status, message) => {
    statusIndicator.className = `status-indicator ${status}`;
    statusText.textContent = message;
  };

  // Username input validation
  usernameInput.addEventListener('input', () => {
    hideError();
    const value = usernameInput.value.trim();
    const error = validateUsername(value);
    
    if (error) {
      usernameInput.classList.add('input-error');
      inputRequirements.textContent = error;
      inputRequirements.classList.add('text-error');
    } else {
      usernameInput.classList.remove('input-error');
      inputRequirements.textContent = '3-20 characters, letters and numbers only';
      inputRequirements.classList.remove('text-error');
    }
  });

  // Form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const username = usernameInput.value.trim();
    const validationError = validateUsername(username);
    
    if (validationError) {
      showError(validationError);
      usernameInput.focus();
      return;
    }

    if (!socketClient.isConnected) {
      showError('Not connected to server. Please wait and try again.');
      return;
    }

    isSubmitting = true;
    showLoading();
    hideError();

    try {
      socketClient.register(username);
    } catch (error) {
      hideLoading();
      showError('Failed to connect to server');
    }
  });

  // Socket event listeners
  socketClient.on('register_success', () => {
    hideLoading();
    // Will be handled by main app
  });

  socketClient.on('register_error', (data) => {
    hideLoading();
    showError(data.message || 'Registration failed');
    usernameInput.focus();
  });

  socketClient.on('disconnected', () => {
    updateConnectionStatus('disconnected', 'Connection lost');
    joinButton.disabled = true;
  });

  socketClient.on('reconnected', () => {
    updateConnectionStatus('connected', 'Connected to server');
    joinButton.disabled = false;
  });

  // Initialize connection status
  if (socketClient.isConnected) {
    updateConnectionStatus('connected', 'Connected to server');
    joinButton.disabled = false;
  } else {
    updateConnectionStatus('connecting', 'Connecting to server...');
    joinButton.disabled = true;
    
    // Try to connect
    socketClient.connect().then(() => {
      updateConnectionStatus('connected', 'Connected to server');
      joinButton.disabled = false;
    }).catch(() => {
      updateConnectionStatus('error', 'Connection failed');
      showError('Unable to connect to server. Please refresh the page.');
    });
  }

  // Focus username input
  setTimeout(() => {
    usernameInput.focus();
  }, 100);

  return {
    loginContainer,
    usernameInput,
    joinButton,
    showError,
    hideError,
    showLoading,
    hideLoading
  };
}
