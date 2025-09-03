import createLoginScreen from './dom_module/login-screen.js';
import createLobbyScreen from './dom_module/lobby-screen.js';
import createMultiplayerGameSetup from './dom_module/multiplayer-game-setup.js';
import createAIGameSetup from './dom_module/ai-game-setup.js';
import createGamePlayPage from './dom_module/game-play.js';
import createAIGamePlayPage from './dom_module/ai-game-play.js';
import createRoundLossPage from './dom_module/round-loss-modal.js';
import createRoundWinPage from './dom_module/round-win-modal.js';

import GameController from './game-controller.js';
import HardComputerPlayer from './hard-computer.js';
import socketClient from './services/socket-client.js';

import './style.css';
import './styles/multiplayer.css';

// Application state
let appState = {
  currentScreen: null,
  currentUser: null,
  currentGame: null,
  gameController: null,
  gameMode: null, // 'multiplayer' or 'ai'
  aiDifficulty: 'normal', // 'normal' or 'hard'
  lobbyScreen: null
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
    // Initialize socket connection
    await socketClient.connect();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('battleship_user');
    if (savedUser) {
      appState.currentUser = savedUser;
      showLobbyScreen();
    } else {
      showLoginScreen();
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showConnectionError();
  }
}

function showConnectionError() {
  const errorScreen = document.createElement('div');
  errorScreen.className = 'error-screen full-height d-flex justify-content__center align-items__center';
  errorScreen.innerHTML = `
    <div class="glass-card padding_3r text-align__center">
      <h2>Connection Error</h2>
      <p>Unable to connect to the server. Please check your connection and try again.</p>
      <button class="btn-primary" onclick="location.reload()">Retry</button>
    </div>
  `;
  changeScreen(errorScreen);
}

function showLoginScreen() {
  const loginScreen = createLoginScreen();
  changeScreen(loginScreen.loginContainer);

  // Handle login success
  window.addEventListener('userLoggedIn', (e) => {
    appState.currentUser = e.detail.username;
    localStorage.setItem('battleship_user', e.detail.username);
    showLobbyScreen();
  });
}

function showLobbyScreen() {
  const lobbyScreen = createLobbyScreen(appState.currentUser);
  appState.lobbyScreen = lobbyScreen;
  changeScreen(lobbyScreen.lobbyContainer);

  // Handle game invitations and multiplayer events
  socketClient.on('invitation_received', (data) => {
    const accept = confirm(`${data.from} wants to play with you. Accept?`);
    if (accept) {
      socketClient.acceptInvitation(data.from);
    } else {
      socketClient.declineInvitation(data.from);
    }
  });

  socketClient.on('game_started', (data) => {
    appState.currentGame = data;
    appState.gameMode = 'multiplayer';
    showGameSetupScreen(data);
  });

  // Handle AI game start with difficulty
  window.addEventListener('startAIGameWithDifficulty', (e) => {
    appState.gameMode = 'ai';
    appState.aiDifficulty = e.detail.difficulty;
    showAIGameSetup();
  });

  // Handle disconnection
  socketClient.on('disconnected', () => {
    showLoginScreen();
    appState.currentUser = null;
    localStorage.removeItem('battleship_user');
  });

  // Handle opponent disconnect during game
  socketClient.on('opponent_disconnected', () => {
    alert('Your opponent disconnected. Returning to lobby...');
    showLobbyScreen();
  });
}

function showGameSetupScreen(gameData) {
  const setupScreen = createMultiplayerGameSetup(gameData);
  changeScreen(setupScreen.setupContainer);

  // Handle setup complete
  window.addEventListener('setupComplete', () => {
    showGamePlayScreen(gameData);
  });
}

function showAIGameSetup() {
  const aiSetupScreen = createAIGameSetup();
  changeScreen(aiSetupScreen.setupContainer);

  // Initialize game controller for AI game
  appState.gameController = new GameController();
  appState.gameController.startRound();

  // Handle auto place ships
  window.addEventListener('autoPlaceShips', () => {
    appState.gameController.autoPlaceHumanPlayerShips();
    
    // Get ship details and update UI
    const shipDetails = appState.gameController.humanPlayerShipDetails();
    const ships = Object.values(shipDetails);
    
    // Clear existing ships
    aiSetupScreen.clearAllShips();
    
    // Place ships on UI
    ships.forEach((ship, index) => {
      if (ship.isOnBoard) {
        const shipElement = aiSetupScreen.shipElements[index];
        if (shipElement) {
          const [x, y] = ship.placeHead;
          shipElement.dataset.orientation = ship.orientation.toUpperCase();
          
          // Place ship on board
          if (aiSetupScreen.placeShipOnBoard(shipElement, x, y)) {
            console.log(`Placed ${ship.name} at ${x},${y}`);
          }
        }
      }
    });
  });

  // Handle start AI battle
  window.addEventListener('startAIBattle', () => {
    // Use appropriate AI difficulty
    if (appState.aiDifficulty === 'hard') {
      // Replace the computer player with hard AI
      const gameRound = appState.gameController._GAME_ROUND || appState.gameController.gameRound;
      if (gameRound) {
        const hardAI = new HardComputerPlayer();
        hardAI.autoPlaceAllShips();
        appState.hardAI = hardAI;
      }
    } else {
      appState.gameController.autoPlaceBotShips();
    }
    
    showAIGamePlayScreen();
  });

  // Handle back to lobby
  window.addEventListener('backToLobby', () => {
    showLobbyScreen();
  });
}

function showGamePlayScreen(gameData) {
  const gamePlayScreen = createGamePlayPage();
  changeScreen(gamePlayScreen.gamePlayContainer);

  // Set up multiplayer game logic
  setupMultiplayerGameplay(gamePlayScreen, gameData);
}

function showAIGamePlayScreen() {
  const gamePlayScreen = createAIGamePlayPage();
  changeScreen(gamePlayScreen.gamePlayContainer);

  // Set up AI game logic
  setupAIGameplay(gamePlayScreen);
}

function setupMultiplayerGameplay(gamePlayScreen, gameData) {
  // Multiplayer gameplay logic (existing code)
  console.log('Setting up multiplayer gameplay', gameData);
}

function setupAIGameplay(gamePlayScreen) {
  const {
    playerBoardCells,
    aiBoardCells,
    statusText,
    turnIndicator,
    playerStatus,
    aiStatus,
    gameInfoText,
    homeButton,
    surrenderButton
  } = gamePlayScreen;

  let isMyTurn = true;
  let gameOver = false;
  let playerShipsRemaining = 5;
  let aiShipsRemaining = 5;

  // Update turn indicators
  function updateTurnIndicators(isHuman) {
    isMyTurn = isHuman;
    statusText.textContent = isHuman ? 'Your Turn' : 'AI Turn';
    turnIndicator.classList.toggle('active', isHuman);
    gameInfoText.textContent = isHuman ? 'Click on enemy board to attack' : 'AI is thinking...';
  }

  // Show victory modal
  function showVictoryModal() {
    setTimeout(() => {
      alert('🎉 Victory! You defeated the AI!');
      showLobbyScreen();
    }, 500);
  }

  // Show defeat modal
  function showDefeatModal() {
    setTimeout(() => {
      alert('💀 Defeat! The AI has won this battle.');
      showLobbyScreen();
    }, 500);
  }

  // Initialize player ships display
  function displayPlayerShips() {
    const shipDetails = appState.gameController.humanPlayerShipDetails();
    const ships = Object.values(shipDetails);
    
    ships.forEach((ship) => {
      if (ship.isOnBoard) {
        const [startX, startY] = ship.placeHead;
        const size = ship.shipSize;
        const orientation = ship.orientation;
        
        for (let i = 0; i < size; i++) {
          const x = orientation === 'HORIZONTAL' ? startX + i : startX;
          const y = orientation === 'VERTICAL' ? startY + i : startY;
          
          const cell = playerBoardCells.find(c => 
            parseInt(c.dataset.x) === x && parseInt(c.dataset.y) === y
          );
          
          if (cell) {
            cell.dataset.hasShip = 'true';
            cell.classList.add('has-ship');
          }
        }
      }
    });
  }

  // AI makes a move
  function makeAIMove() {
    if (gameOver) return;
    
    try {
      const [aiX, aiY] = appState.gameController.computerPlayerMove();
      const targetCell = playerBoardCells.find(cell => 
        parseInt(cell.dataset.x) === aiX && parseInt(cell.dataset.y) === aiY
      );
      
      if (targetCell) {
        const aiHitStatus = appState.gameController.computerPlayerGetHitStatus();
        targetCell.classList.add('attacked');
        
        if (aiHitStatus === 0) {
          // Miss
          targetCell.classList.add('miss');
          targetCell.textContent = '💧';
          updateTurnIndicators(true);
        } else if (aiHitStatus === 1) {
          // Hit
          targetCell.classList.add('hit');
          targetCell.textContent = '💥';
          setTimeout(() => makeAIMove(), 1000);
        } else if (aiHitStatus === 2) {
          // Ship sunk
          targetCell.classList.add('hit', 'sunk');
          targetCell.textContent = '💥';
          
          playerShipsRemaining--;
          playerStatus.textContent = `Ships: ${playerShipsRemaining}/5`;
          
          setTimeout(() => makeAIMove(), 1000);
        }
        
        // Check for game end
        const { roundWon, winnerName } = appState.gameController.roundState;
        if (roundWon) {
          gameOver = true;
          setTimeout(() => {
            if (winnerName === 'Human') {
              showVictoryModal();
            } else {
              showDefeatModal();
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('AI move error:', error);
      updateTurnIndicators(true);
    }
  }

  updateTurnIndicators(true);

  // Handle attacks on AI's board
  aiBoardCells.forEach(cell => {
    cell.addEventListener('click', (e) => {
      if (!isMyTurn || gameOver) return;
      
      const target = e.target;
      if (target.dataset.attacked === 'true') return;
      
      const x = parseInt(target.dataset.x);
      const y = parseInt(target.dataset.y);
      
      // Mark as attacked
      target.dataset.attacked = 'true';
      target.classList.add('attacked');
      
      // Make human move
      const hitStatus = appState.gameController.humanPlayerMove(x, y);
      
      if (hitStatus === 0) {
        // Miss
        target.classList.add('miss');
        target.textContent = '💧';
      } else if (hitStatus === 1) {
        // Hit
        target.classList.add('hit');
        target.textContent = '💥';
        target.dataset.hasShip = 'true';
      } else if (hitStatus === 2) {
        // Ship sunk
        target.classList.add('hit', 'sunk');
        target.textContent = '💥';
        target.dataset.hasShip = 'true';
        
        aiShipsRemaining--;
        aiStatus.textContent = `Ships: ${aiShipsRemaining}/5`;
      }

      // Check for game end
      const { roundWon, winnerName } = appState.gameController.roundState;
      if (roundWon) {
        gameOver = true;
        setTimeout(() => {
          if (winnerName === 'Human') {
            showVictoryModal();
          } else {
            showDefeatModal();
          }
        }, 1000);
        return;
      }

      // If miss, switch to AI turn
      if (hitStatus === 0) {
        updateTurnIndicators(false);
        setTimeout(() => {
          makeAIMove();
        }, 1000);
      }
    });
  });

  // Initialize ships
  displayPlayerShips();

  // Button handlers
  homeButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave the game?')) {
      showLobbyScreen();
    }
  });

  surrenderButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to surrender?')) {
      gameOver = true;
      showDefeatModal();
    }
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
