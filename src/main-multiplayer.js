import createLoginScreen from './dom_module/login-screen.js';
import createLobbyScreen from './dom_module/lobby-screen.js';
import createMultiplayerGameSetup from './dom_module/multiplayer-game-setup.js';
import createGamePlayPage from './dom_module/game-play.js';
import createRoundLossPage from './dom_module/round-loss-modal.js';
import createRoundWinPage from './dom_module/round-win-modal.js';

import GameController from './game-controller.js';
import socketClient from './services/socket-client.js';

import './style.css';
import './styles/multiplayer.css';

// Application state
let appState = {
  currentScreen: null,
  currentUser: null,
  currentGame: null,
  gameController: null
};

// Screen management
const DOC_BODY = document.querySelector('body');

function changeScreen(screenElement, delay = 100) {
  setTimeout(() => {
    DOC_BODY.innerHTML = '';
    DOC_BODY.appendChild(screenElement);
    appState.currentScreen = screenElement;
  }, delay);
}

function showModal(modalElement) {
  DOC_BODY.appendChild(modalElement);
  modalElement.showModal();
}

function hideModal(modalElement) {
  modalElement.close();
  if (modalElement.parentNode) {
    modalElement.parentNode.removeChild(modalElement);
  }
}

// Application initialization
async function initializeApp() {
  try {
    // Show loading screen while connecting
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen centered_flex full-height animated-bg';
    loadingScreen.innerHTML = `
      <div class="loading-content text-align__center">
        <div class="spinner" style="margin: 0 auto 1rem auto;"></div>
        <h2 style="color: white; margin: 0;">Connecting to Battle Server...</h2>
        <p style="color: rgba(255,255,255,0.7); margin: 0.5rem 0 0 0;">Initializing multiplayer systems</p>
      </div>
    `;
    changeScreen(loadingScreen);

    // Connect to server
    await socketClient.connect();
    
    // Show login screen
    showLoginScreen();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showConnectionError();
  }
}

function showConnectionError() {
  const errorScreen = document.createElement('div');
  errorScreen.className = 'error-screen centered_flex full-height animated-bg';
  errorScreen.innerHTML = `
    <div class="error-content glass-card padding_3r text-align__center" style="max-width: 400px;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
      <h2 style="color: white; margin: 0 0 1rem 0;">Connection Failed</h2>
      <p style="color: rgba(255,255,255,0.7); margin: 0 0 2rem 0;">
        Unable to connect to the game server. Please check your internet connection and try again.
      </p>
      <button class="btn-primary btn-lg cursor_pointer" onclick="location.reload()">
        Try Again
      </button>
    </div>
  `;
  changeScreen(errorScreen);
}

function showLoginScreen() {
  const loginScreen = createLoginScreen();
  changeScreen(loginScreen.loginContainer);

  // Handle successful login
  socketClient.on('register_success', (data) => {
    appState.currentUser = data.username;
    showLobbyScreen();
  });
}

function showLobbyScreen() {
  const lobbyScreen = createLobbyScreen(appState.currentUser);
  changeScreen(lobbyScreen.lobbyContainer);

  // Handle game start
  socketClient.on('game_start', (data) => {
    appState.currentGame = data;
    showGameSetupScreen(data);
  });

  // Handle disconnection
  socketClient.on('disconnected', () => {
    showLoginScreen();
    appState.currentUser = null;
    appState.currentGame = null;
  });
}

function showGameSetupScreen(gameData) {
  const setupScreen = createMultiplayerGameSetup(gameData);
  changeScreen(setupScreen.setupContainer);

  // Initialize game controller for this game
  appState.gameController = new GameController();
  appState.gameController.startRound();

  // Handle game ready (both players finished setup)
  socketClient.on('game_ready', (data) => {
    showGamePlayScreen(data);
  });

  // Handle opponent disconnect during setup
  socketClient.on('opponent_disconnected', () => {
    alert('Your opponent disconnected. Returning to lobby...');
    showLobbyScreen();
  });
}

function showGamePlayScreen(gameData) {
  const gamePlayScreen = createGamePlayPage();
  changeScreen(gamePlayScreen.gamePlayContainer);

  // Set up multiplayer game logic
  setupMultiplayerGameplay(gamePlayScreen, gameData);
}

function setupMultiplayerGameplay(gamePlayScreen, gameData) {
  const {
    turnMarkers,
    humanPlayerStructure,
    botPlayerStructure,
    homeIconContainer,
  } = gamePlayScreen;

  const [turnMarkerEl, turnMarkerEl2] = turnMarkers;
  let isMyTurn = gameData.currentTurn === appState.currentUser;

  // Update turn indicators
  function updateTurnIndicators(currentPlayer) {
    isMyTurn = currentPlayer === appState.currentUser;
    const indicator = isMyTurn ? 'human' : 'bot';
    turnMarkerEl.dataset.turnIndicator = indicator;
    turnMarkerEl2.dataset.turnIndicator = indicator;
  }

  updateTurnIndicators(gameData.currentTurn);

  // Handle attacks on opponent's board
  botPlayerStructure.playerBoard.addEventListener('click', (e) => {
    const { target } = e;

    if (!target.classList.contains('board-item')) return;
    if (!isMyTurn) {
      alert('Wait for your turn!');
      return;
    }
    if (Number(target.dataset.hitStatus) >= 0) return;

    const { x, y } = target.dataset;
    const move = {
      x: Number(x),
      y: Number(y),
      timestamp: Date.now()
    };

    // Make move through socket
    socketClient.makeGameMove(appState.currentGame.gameId, move);
  });

  // Handle incoming moves
  socketClient.on('move_made', (data) => {
    const { move, byPlayer, nextTurn } = data;
    const { x, y } = move;

    if (byPlayer === appState.currentUser) {
      // My move - update opponent's board
      const hitStatus = appState.gameController.humanPlayerMove(x, y);
      const boardItem = botPlayerStructure.boardNodesContainer.querySelector(
        `.board-item[data-x='${x}'][data-y='${y}']`
      );
      boardItem.dataset.hitStatus = hitStatus;

      // Check for ship sinking and game end
      if (hitStatus === 2) {
        processHumanShipSink(appState.gameController, botPlayerStructure);
      }

      const { roundWon } = appState.gameController.roundState;
      if (roundWon) {
        socketClient.endGame(appState.currentGame.gameId, appState.currentUser);
        showVictoryModal();
        return;
      }
    } else {
      // Opponent's move - update my board
      const hitStatus = appState.gameController.computerPlayerMove();
      const boardItem = humanPlayerStructure.boardNodesContainer.querySelector(
        `.board-item[data-x='${x}'][data-y='${y}']`
      );
      boardItem.dataset.hitStatus = hitStatus.hitStatus;

      // Check for ship sinking and game end
      if (hitStatus.hitStatus === 2) {
        processBotShipSink(appState.gameController, humanPlayerStructure);
      }

      const { roundWon } = appState.gameController.roundState;
      if (roundWon) {
        socketClient.endGame(appState.currentGame.gameId, byPlayer);
        showDefeatModal();
        return;
      }
    }

    updateTurnIndicators(nextTurn);
  });

  // Handle game end
  socketClient.on('game_finished', (data) => {
    if (data.winner === appState.currentUser) {
      showVictoryModal();
    } else {
      showDefeatModal();
    }
  });

  // Handle opponent disconnect
  socketClient.on('opponent_disconnected', () => {
    alert('Your opponent disconnected. You win by default!');
    showVictoryModal();
  });

  // Home button
  homeIconContainer.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave the game?')) {
      showLobbyScreen();
    }
  });
}

// Helper functions for ship sinking (reused from original code)
function processHumanShipSink(gameController, botPlayerStructure) {
  const botPlayerShipDetails = gameController.botPlayerShipDetails();
  const botShipsDetails = Object.values(botPlayerShipDetails);

  botShipsDetails.forEach((shipDetails) => {
    const { isSunk, name, size, placeHead, orientation } = shipDetails;
    
    if (isSunk) {
      const shipEl = botPlayerStructure.botShipYard.querySelector(`.ship.${name}`);
      if (shipEl) {
        shipEl.classList.add('sunk');
      }
    }
  });
}

function processBotShipSink(gameController, humanPlayerStructure) {
  const humanPlayerShipDetails = gameController.humanPlayerShipDetails();
  const humanShipDetails = Object.values(humanPlayerShipDetails);

  humanShipDetails.forEach((shipDetails) => {
    const { isSunk, name } = shipDetails;
    
    if (isSunk) {
      // Visual feedback for sunk ship
      console.log(`Your ${name} has been sunk!`);
    }
  });
}

function showVictoryModal() {
  const victoryModal = createRoundWinPage();
  showModal(victoryModal.roundWinDialog);

  victoryModal.homeBtn.addEventListener('click', () => {
    hideModal(victoryModal.roundWinDialog);
    showLobbyScreen();
  });
}

function showDefeatModal() {
  const defeatModal = createRoundLossPage();
  showModal(defeatModal.roundLossDialog);

  defeatModal.homeBtn.addEventListener('click', () => {
    hideModal(defeatModal.roundLossDialog);
    showLobbyScreen();
  });
}

// Handle page visibility and cleanup
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // Page is hidden, but don't disconnect immediately
    // The server will handle cleanup on actual disconnect
  }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (socketClient.isConnected) {
    socketClient.disconnect();
  }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// Export for debugging
window.appState = appState;
window.socketClient = socketClient;
