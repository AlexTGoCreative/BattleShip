import createElementWithClass from '../helper_module/create-element-with-class.js';
import socketClient from '../services/socket-client.js';
import { reverseTransform } from '../helper_module/number-transform.js';
import GAME_SETTINGS from '../GAME_SETTINGS/game-settings.js';

const { BOARD_SPECS } = GAME_SETTINGS;
const { BOARD_X_SIZE } = BOARD_SPECS;

export default function createMultiplayerGameSetup(gameData) {
  const setupContainer = createElementWithClass('div', [
    'multiplayer-setup',
    'full-height',
    'd-flex__col',
    'animated-bg'
  ]);

  // Header
  const header = createElementWithClass('header', [
    'setup-header',
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

  const gameInfo = createElementWithClass('div', [
    'game-info'
  ]);

  const gameTitle = createElementWithClass('h2', [
    'game-title'
  ]);
  gameTitle.textContent = 'Battle Setup';

  const opponentInfo = createElementWithClass('p', [
    'opponent-info',
    'text-muted'
  ]);
  opponentInfo.textContent = `VS ${gameData.opponent}`;

  gameInfo.appendChild(gameTitle);
  gameInfo.appendChild(opponentInfo);

  const headerActions = createElementWithClass('div', [
    'header-actions',
    'd-flex',
    'gap_1r'
  ]);

  const leaveButton = createElementWithClass('button', [
    'btn-danger',
    'cursor_pointer'
  ]);
  leaveButton.textContent = 'Leave Game';

  headerActions.appendChild(leaveButton);
  headerContent.appendChild(gameInfo);
  headerContent.appendChild(headerActions);
  header.appendChild(headerContent);

  // Main content
  const mainContent = createElementWithClass('main', [
    'setup-main',
    'd-flex',
    'gap_2r',
    'flex-grow',
    'padding_0_2r'
  ]);

  // Ship setup section
  const setupSection = createElementWithClass('section', [
    'ship-setup-section',
    'glass-card',
    'padding_2r',
    'flex-grow'
  ]);

  const setupSectionHeader = createElementWithClass('div', [
    'section-header',
    'd-flex',
    'justify-content__between',
    'align-items__center',
    'margin-bottom_2r'
  ]);

  const setupTitle = createElementWithClass('h3', [
    'section-title'
  ]);
  setupTitle.textContent = 'Position Your Fleet';

  const setupProgress = createElementWithClass('div', [
    'setup-progress',
    'd-flex',
    'align-items__center',
    'gap_1r'
  ]);

  const progressText = createElementWithClass('span', [
    'progress-text'
  ]);
  progressText.textContent = '0/5 ships placed';

  const progressBar = createElementWithClass('div', [
    'progress-bar'
  ]);

  const progressFill = createElementWithClass('div', [
    'progress-fill'
  ]);
  progressFill.style.width = '0%';

  progressBar.appendChild(progressFill);
  setupProgress.appendChild(progressText);
  setupProgress.appendChild(progressBar);

  setupSectionHeader.appendChild(setupTitle);
  setupSectionHeader.appendChild(setupProgress);

  // Game board
  const boardContainer = createElementWithClass('div', [
    'board-container',
    'margin-bottom_2r'
  ]);

  const gameBoard = createElementWithClass('div', [
    'game-board',
    'player-board'
  ]);

  const rowLabels = createElementWithClass('div', [
    'row-labels',
    'gap_2',
    'centered_flex'
  ]);

  const colLabels = createElementWithClass('div', [
    'col-labels',
    'gap_2',
    'centered_flex'
  ]);

  const boardGrid = createElementWithClass('div', [
    'board-grid',
    'gap_2'
  ]);

  // Create board cells
  for (let i = 0; i < BOARD_X_SIZE * BOARD_X_SIZE; i += 1) {
    const cell = createElementWithClass('button', [
      'board-cell',
      'cursor_pointer'
    ]);
    const [x, y] = reverseTransform(i, BOARD_X_SIZE);
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.dataset.hasShip = false;
    cell.style.gridArea = `X${x}-Y${y}`;
    boardGrid.appendChild(cell);
  }

  // Create labels
  for (let i = 0; i < BOARD_X_SIZE; i += 1) {
    const rowLabel = createElementWithClass('div', [
      'label-item',
      'centered_flex'
    ]);
    rowLabel.textContent = String.fromCharCode(i + 65);
    rowLabels.appendChild(rowLabel);

    const colLabel = createElementWithClass('div', [
      'label-item',
      'centered_flex'
    ]);
    colLabel.textContent = (i + 1).toString();
    colLabels.appendChild(colLabel);
  }

  gameBoard.appendChild(rowLabels);
  gameBoard.appendChild(colLabels);
  gameBoard.appendChild(boardGrid);
  boardContainer.appendChild(gameBoard);

  // Ship controls
  const shipControls = createElementWithClass('div', [
    'ship-controls',
    'd-flex',
    'justify-content__between',
    'align-items__center',
    'margin-bottom_2r'
  ]);

  const controlsLeft = createElementWithClass('div', [
    'controls-left',
    'd-flex',
    'gap_1r'
  ]);

  const rotateButton = createElementWithClass('button', [
    'btn-secondary',
    'cursor_pointer'
  ]);
  rotateButton.textContent = '🔄 Rotate';

  const autoPlaceButton = createElementWithClass('button', [
    'btn-secondary',
    'cursor_pointer'
  ]);
  autoPlaceButton.textContent = '🎲 Auto Place';

  const clearButton = createElementWithClass('button', [
    'btn-warning',
    'cursor_pointer'
  ]);
  clearButton.textContent = '🗑️ Clear All';

  controlsLeft.appendChild(rotateButton);
  controlsLeft.appendChild(autoPlaceButton);
  controlsLeft.appendChild(clearButton);

  const readyButton = createElementWithClass('button', [
    'btn-success',
    'btn-lg',
    'cursor_pointer'
  ]);
  readyButton.textContent = 'Ready for Battle!';
  readyButton.disabled = true;

  shipControls.appendChild(controlsLeft);
  shipControls.appendChild(readyButton);

  setupSection.appendChild(setupSectionHeader);
  setupSection.appendChild(boardContainer);
  setupSection.appendChild(shipControls);

  // Ship fleet section
  const fleetSection = createElementWithClass('section', [
    'fleet-section',
    'glass-card',
    'padding_2r',
    'width-300'
  ]);

  const fleetHeader = createElementWithClass('h3', [
    'section-title',
    'margin-bottom_2r'
  ]);
  fleetHeader.textContent = 'Your Fleet';

  const shipsList = createElementWithClass('div', [
    'ships-list',
    'd-flex__col',
    'gap_1r'
  ]);

  // Ship types
  const ships = [
    { name: 'Carrier', size: 5, className: 'carrier' },
    { name: 'Battleship', size: 4, className: 'battleship' },
    { name: 'Destroyer', size: 3, className: 'destroyer' },
    { name: 'Submarine', size: 3, className: 'submarine' },
    { name: 'Patrol Boat', size: 2, className: 'patrol-boat' }
  ];

  ships.forEach(ship => {
    const shipItem = createElementWithClass('div', [
      'ship-item',
      'd-flex',
      'justify-content__between',
      'align-items__center',
      'padding_1r',
      'cursor_pointer',
      ship.className
    ]);

    const shipInfo = createElementWithClass('div', [
      'ship-info'
    ]);

    const shipName = createElementWithClass('div', [
      'ship-name'
    ]);
    shipName.textContent = ship.name;

    const shipSize = createElementWithClass('div', [
      'ship-size',
      'text-small',
      'text-muted'
    ]);
    shipSize.textContent = `${ship.size} cells`;

    shipInfo.appendChild(shipName);
    shipInfo.appendChild(shipSize);

    const shipStatus = createElementWithClass('div', [
      'ship-status'
    ]);
    shipStatus.innerHTML = '⚪'; // Not placed

    shipItem.appendChild(shipInfo);
    shipItem.appendChild(shipStatus);
    shipsList.appendChild(shipItem);

    // Store ship data
    shipItem.dataset.shipType = ship.className;
    shipItem.dataset.shipSize = ship.size;
    shipItem.dataset.orientation = 'horizontal';
  });

  fleetSection.appendChild(fleetHeader);
  fleetSection.appendChild(shipsList);

  // Status section
  const statusSection = createElementWithClass('section', [
    'status-section',
    'glass-card',
    'padding_2r',
    'margin-top_2r'
  ]);

  const statusHeader = createElementWithClass('h3', [
    'section-title',
    'margin-bottom_1r'
  ]);
  statusHeader.textContent = 'Game Status';

  const playerStatus = createElementWithClass('div', [
    'player-status',
    'd-flex__col',
    'gap_1r'
  ]);

  const myStatus = createElementWithClass('div', [
    'status-item',
    'd-flex',
    'justify-content__between',
    'align-items__center'
  ]);

  const myStatusLabel = createElementWithClass('span', []);
  myStatusLabel.textContent = 'You:';

  const myStatusIndicator = createElementWithClass('span', [
    'status-indicator',
    'not-ready'
  ]);
  myStatusIndicator.textContent = 'Setting up...';

  myStatus.appendChild(myStatusLabel);
  myStatus.appendChild(myStatusIndicator);

  const opponentStatus = createElementWithClass('div', [
    'status-item',
    'd-flex',
    'justify-content__between',
    'align-items__center'
  ]);

  const opponentStatusLabel = createElementWithClass('span', []);
  opponentStatusLabel.textContent = `${gameData.opponent}:`;

  const opponentStatusIndicator = createElementWithClass('span', [
    'status-indicator',
    'not-ready'
  ]);
  opponentStatusIndicator.textContent = 'Setting up...';

  opponentStatus.appendChild(opponentStatusLabel);
  opponentStatus.appendChild(opponentStatusIndicator);

  playerStatus.appendChild(myStatus);
  playerStatus.appendChild(opponentStatus);

  statusSection.appendChild(statusHeader);
  statusSection.appendChild(playerStatus);

  fleetSection.appendChild(statusSection);
  mainContent.appendChild(setupSection);
  mainContent.appendChild(fleetSection);

  setupContainer.appendChild(header);
  setupContainer.appendChild(mainContent);

  // State management
  let selectedShip = null;
  let placedShips = 0;
  let isReady = false;

  // Utility functions
  const updateProgress = () => {
    const percentage = (placedShips / 5) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${placedShips}/5 ships placed`;
    
    if (placedShips === 5) {
      readyButton.disabled = false;
      readyButton.classList.add('btn-pulse');
    } else {
      readyButton.disabled = true;
      readyButton.classList.remove('btn-pulse');
    }
  };

  const selectShip = (shipElement) => {
    // Remove previous selection
    document.querySelectorAll('.ship-item').forEach(ship => {
      ship.classList.remove('selected');
    });

    selectedShip = shipElement;
    shipElement.classList.add('selected');
  };

  // Event listeners
  shipsList.addEventListener('click', (e) => {
    const shipItem = e.target.closest('.ship-item');
    if (shipItem && !shipItem.classList.contains('placed')) {
      selectShip(shipItem);
    }
  });

  rotateButton.addEventListener('click', () => {
    if (selectedShip) {
      const currentOrientation = selectedShip.dataset.orientation;
      const newOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
      selectedShip.dataset.orientation = newOrientation;
      rotateButton.textContent = `🔄 Rotate (${newOrientation})`;
    }
  });

  readyButton.addEventListener('click', () => {
    if (placedShips === 5 && !isReady) {
      isReady = true;
      socketClient.setPlayerReady(gameData.gameId);
      readyButton.disabled = true;
      readyButton.textContent = 'Waiting for opponent...';
      myStatusIndicator.textContent = 'Ready!';
      myStatusIndicator.className = 'status-indicator ready';
    }
  });

  leaveButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave the game?')) {
      // Will be handled by main app
      window.history.back();
    }
  });

  // Socket event listeners
  socketClient.on('player_ready_update', (data) => {
    const { player1Ready, player2Ready } = data;
    const isPlayer1 = gameData.isPlayer1;
    
    if (isPlayer1) {
      if (player2Ready) {
        opponentStatusIndicator.textContent = 'Ready!';
        opponentStatusIndicator.className = 'status-indicator ready';
      }
    } else {
      if (player1Ready) {
        opponentStatusIndicator.textContent = 'Ready!';
        opponentStatusIndicator.className = 'status-indicator ready';
      }
    }
  });

  socketClient.on('game_ready', () => {
    // Both players are ready, game will start
    // Will be handled by main app
  });

  // Join the game room
  socketClient.joinGame(gameData.gameId);

  // Auto-select first ship
  const firstShip = shipsList.querySelector('.ship-item');
  if (firstShip) {
    selectShip(firstShip);
  }

  return {
    setupContainer,
    boardGrid,
    shipsList,
    updateProgress,
    selectShip
  };
}
