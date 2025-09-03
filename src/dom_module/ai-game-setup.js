import createElementWithClass from '../helper_module/create-element-with-class.js';
import { reverseTransform } from '../helper_module/number-transform.js';
import GAME_SETTINGS from '../GAME_SETTINGS/game-settings.js';

const { BOARD_SPECS } = GAME_SETTINGS;
const { BOARD_X_SIZE } = BOARD_SPECS;

export default function createAIGameSetup() {
  const setupContainer = createElementWithClass('div', [
    'ai-game-setup',
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
  gameTitle.textContent = 'Battle vs AI';

  const opponentInfo = createElementWithClass('p', [
    'opponent-info',
    'text-muted'
  ]);
  opponentInfo.textContent = 'VS JARVIS Computer';

  gameInfo.appendChild(gameTitle);
  gameInfo.appendChild(opponentInfo);

  const headerActions = createElementWithClass('div', [
    'header-actions',
    'd-flex',
    'gap_1r'
  ]);

  const backButton = createElementWithClass('button', [
    'btn-secondary',
    'cursor_pointer'
  ]);
  backButton.textContent = '← Back to Lobby';

  headerActions.appendChild(backButton);
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

  const instructionsCard = createElementWithClass('div', [
    'instructions-card',
    'glass-card',
    'margin-bottom_2r'
  ]);

  const instructionsHeader = createElementWithClass('div', [
    'instructions-header',
    'd-flex',
    'align-items__center',
    'gap_1r',
    'margin-bottom_1r'
  ]);

  const instructionsIcon = createElementWithClass('span', [
    'instructions-icon'
  ]);
  instructionsIcon.textContent = '🎯';

  const instructionsTitle = createElementWithClass('h4', [
    'instructions-title',
    'text-gradient'
  ]);
  instructionsTitle.textContent = 'Ship Placement Guide';

  instructionsHeader.appendChild(instructionsIcon);
  instructionsHeader.appendChild(instructionsTitle);

  const instructionsList = createElementWithClass('div', [
    'instructions-list',
    'd-flex__col',
    'gap_05r'
  ]);

  const instructions = [
    { icon: '🖱️', text: 'Click ships to select them' },
    { icon: '🔄', text: 'Use rotate button or click ship again to rotate' },
    { icon: '📍', text: 'Click on board to place selected ship' },
    { icon: '⚡', text: 'Use Auto Place for instant setup' }
  ];

  instructions.forEach(instruction => {
    const instructionItem = createElementWithClass('div', [
      'instruction-item',
      'd-flex',
      'align-items__center',
      'gap_1r'
    ]);

    const instructionIcon = createElementWithClass('span', [
      'instruction-icon'
    ]);
    instructionIcon.textContent = instruction.icon;

    const instructionText = createElementWithClass('span', [
      'instruction-text'
    ]);
    instructionText.textContent = instruction.text;

    instructionItem.appendChild(instructionIcon);
    instructionItem.appendChild(instructionText);
    instructionsList.appendChild(instructionItem);
  });

  instructionsCard.appendChild(instructionsHeader);
  instructionsCard.appendChild(instructionsList);

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
  setupSectionHeader.appendChild(instructionsCard);
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
  const boardCells = [];
  for (let i = 0; i < BOARD_X_SIZE * BOARD_X_SIZE; i += 1) {
    const cell = createElementWithClass('button', [
      'board-cell',
      'cursor_pointer'
    ]);
    const [x, y] = reverseTransform(i, BOARD_X_SIZE);
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.dataset.hasShip = 'false';
    boardGrid.appendChild(cell);
    boardCells.push(cell);
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

  // Ships container - original style
  const shipsContainer = createElementWithClass('div', [
    'ship-yard',
    'd-flex',
    'gap_1r',
    'justify-content__center',
    'margin-bottom_2r',
    'flex-wrap'
  ]);

  gameBoard.appendChild(rowLabels);
  gameBoard.appendChild(colLabels);
  gameBoard.appendChild(boardGrid);
  boardContainer.appendChild(gameBoard);
  boardContainer.appendChild(shipsContainer);

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
  rotateButton.dataset.rotate = 'VERTICAL';

  const autoPlaceButton = createElementWithClass('button', [
    'btn-secondary',
    'cursor_pointer'
  ]);
  autoPlaceButton.textContent = '🎲 Auto Place All';

  const clearButton = createElementWithClass('button', [
    'btn-warning',
    'cursor_pointer'
  ]);
  clearButton.textContent = '🗑️ Clear All';

  controlsLeft.appendChild(rotateButton);
  controlsLeft.appendChild(autoPlaceButton);
  controlsLeft.appendChild(clearButton);

  const startGameButton = createElementWithClass('button', [
    'btn-success',
    'btn-lg',
    'cursor_pointer'
  ]);
  startGameButton.textContent = 'Start Battle!';
  startGameButton.disabled = true;

  shipControls.appendChild(controlsLeft);
  shipControls.appendChild(startGameButton);

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

  // Ship details - original approach
  const shipsDetails = [
    {
      classNames: ['ship', 'z_index_2', 'd-flex__col', 'cursor_pointer', 'gap_2', 'carrier'],
      shipSize: 5,
      orientation: 'VERTICAL',
      active: false,
      name: 'carrier',
      displayName: 'Carrier'
    },
    {
      classNames: ['ship', 'z_index_2', 'd-flex__col', 'cursor_pointer', 'battleship', 'gap_2'],
      shipSize: 4,
      orientation: 'VERTICAL',
      active: false,
      name: 'battleship',
      displayName: 'Battleship'
    },
    {
      classNames: ['ship', 'z_index_2', 'd-flex__col', 'cursor_pointer', 'gap_2', 'destroyer'],
      shipSize: 3,
      orientation: 'VERTICAL',
      active: false,
      name: 'destroyer',
      displayName: 'Destroyer'
    },
    {
      classNames: ['ship', 'z_index_2', 'd-flex__col', 'cursor_pointer', 'gap_2', 'submarine'],
      shipSize: 3,
      orientation: 'VERTICAL',
      active: false,
      name: 'submarine',
      displayName: 'Submarine'
    },
    {
      classNames: ['ship', 'z_index_2', 'd-flex__col', 'cursor_pointer', 'gap_2', 'patrol-boat'],
      shipSize: 2,
      orientation: 'VERTICAL',
      active: false,
      name: 'patrol-boat',
      displayName: 'Patrol Boat'
    }
  ];

  const shipElements = [];

  // Create ships using original approach
  shipsDetails.forEach(({ classNames, shipSize, orientation, active, name, displayName }) => {
    const shipContainer = createElementWithClass('div', classNames);
    shipContainer.dataset.orientation = orientation;
    shipContainer.dataset.shipSize = shipSize;
    shipContainer.dataset.active = active;
    shipContainer.dataset.shipName = name;
    shipContainer.dataset.placed = 'false';

    // Create ship nodes
    for (let i = 0; i < shipSize; i += 1) {
      const shipNode = createElementWithClass('div', ['ship-node']);
      shipContainer.appendChild(shipNode);
    }

    shipsContainer.appendChild(shipContainer);
    shipElements.push(shipContainer);

    // Create status item in fleet list
    const shipItem = createElementWithClass('div', [
      'ship-item',
      'd-flex',
      'justify-content__between',
      'align-items__center',
      'padding_1r',
      name
    ]);

    const shipInfo = createElementWithClass('div', [
      'ship-info'
    ]);

    const shipName = createElementWithClass('div', [
      'ship-name'
    ]);
    shipName.textContent = displayName;

    const shipSizeText = createElementWithClass('div', [
      'ship-size',
      'text-small',
      'text-muted'
    ]);
    shipSizeText.textContent = `${shipSize} cells`;

    shipInfo.appendChild(shipName);
    shipInfo.appendChild(shipSizeText);

    const shipStatus = createElementWithClass('div', [
      'ship-status'
    ]);
    shipStatus.innerHTML = '⚪'; // Not placed

    shipItem.appendChild(shipInfo);
    shipItem.appendChild(shipStatus);
    shipsList.appendChild(shipItem);
  });

  fleetSection.appendChild(fleetHeader);
  fleetSection.appendChild(shipsList);

  // AI info section
  const aiInfoSection = createElementWithClass('section', [
    'ai-info-section',
    'glass-card',
    'padding_2r',
    'margin-top_2r'
  ]);

  const aiInfoHeader = createElementWithClass('h3', [
    'section-title',
    'margin-bottom_1r'
  ]);
  aiInfoHeader.textContent = 'AI Opponent';

  const aiInfo = createElementWithClass('div', [
    'ai-info',
    'd-flex__col',
    'gap_1r'
  ]);

  const aiAvatar = createElementWithClass('div', [
    'ai-avatar',
    'centered_flex'
  ]);
  aiAvatar.textContent = '🤖';

  const aiName = createElementWithClass('div', [
    'ai-name',
    'text-align__center',
    'font-weight-600'
  ]);
  aiName.textContent = 'JARVIS';

  const aiDescription = createElementWithClass('div', [
    'ai-description',
    'text-small',
    'text-muted',
    'text-align__center'
  ]);
  aiDescription.textContent = 'Advanced AI opponent with strategic targeting';

  const aiStats = createElementWithClass('div', [
    'ai-stats',
    'd-flex',
    'justify-content__between',
    'text-small'
  ]);

  const aiDifficulty = createElementWithClass('div', []);
  aiDifficulty.innerHTML = '<strong>Level:</strong> Hard';

  const aiStrategy = createElementWithClass('div', []);
  aiStrategy.innerHTML = '<strong>Strategy:</strong> Smart';

  aiStats.appendChild(aiDifficulty);
  aiStats.appendChild(aiStrategy);

  aiInfo.appendChild(aiAvatar);
  aiInfo.appendChild(aiName);
  aiInfo.appendChild(aiDescription);
  aiInfo.appendChild(aiStats);

  aiInfoSection.appendChild(aiInfoHeader);
  aiInfoSection.appendChild(aiInfo);

  fleetSection.appendChild(aiInfoSection);
  mainContent.appendChild(setupSection);
  mainContent.appendChild(fleetSection);

  setupContainer.appendChild(header);
  setupContainer.appendChild(mainContent);

  // State management - original approach
  let selectedShip = null;
  let placedShips = 0;
  let currentOrientation = 'VERTICAL';

  // Utility functions - original approach
  const updateProgress = () => {
    const percentage = (placedShips / 5) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${placedShips}/5 ships placed`;
    
    if (placedShips === 5) {
      startGameButton.disabled = false;
      startGameButton.classList.add('btn-pulse');
    } else {
      startGameButton.disabled = true;
      startGameButton.classList.remove('btn-pulse');
    }
  };

  const selectShip = (shipElement) => {
    // Remove previous selections
    shipElements.forEach(ship => {
      ship.classList.remove('active');
      ship.dataset.active = 'false';
    });

    // Don't select if already placed
    if (shipElement.dataset.placed === 'true') {
      // If clicking placed ship, remove it
      removeShipFromBoard(shipElement);
      return;
    }

    // Select the ship
    selectedShip = shipElement;
    shipElement.classList.add('active');
    shipElement.dataset.active = 'true';
    currentOrientation = shipElement.dataset.orientation;
    
    // Update rotate button
    const nextOrientation = currentOrientation === 'VERTICAL' ? 'HORIZONTAL' : 'VERTICAL';
    rotateButton.dataset.rotate = nextOrientation;
    rotateButton.textContent = `🔄 Rotate (${currentOrientation})`;
  };

  const clearAllShips = () => {
    // Clear board cells
    boardCells.forEach(cell => {
      cell.dataset.hasShip = 'false';
      cell.classList.remove('has-ship');
      cell.style.background = '';
    });

    // Reset all ships to original container
    shipElements.forEach(ship => {
      ship.dataset.placed = 'false';
      ship.classList.remove('placed', 'active');
      ship.dataset.active = 'false';
      
      // Remove from board and put back in container
      if (ship.parentNode !== shipsContainer) {
        shipsContainer.appendChild(ship);
      }
    });

    // Update status indicators
    shipsList.querySelectorAll('.ship-status').forEach(status => {
      status.innerHTML = '⚪';
    });

    placedShips = 0;
    selectedShip = null;
    updateProgress();
  };

  const isValidPlacement = (shipElement, startX, startY) => {
    const size = parseInt(shipElement.dataset.shipSize);
    const orientation = shipElement.dataset.orientation;
    
    for (let i = 0; i < size; i++) {
      const x = orientation === 'HORIZONTAL' ? startX + i : startX;
      const y = orientation === 'VERTICAL' ? startY + i : startY;
      
      if (x >= BOARD_X_SIZE || y >= BOARD_X_SIZE || x < 0 || y < 0) return false;
      
      const cell = boardCells.find(c => 
        parseInt(c.dataset.x) === x && parseInt(c.dataset.y) === y
      );
      
      if (!cell || cell.dataset.hasShip === 'true') return false;
    }
    
    return true;
  };

  const placeShipOnBoard = (shipElement, startX, startY) => {
    const size = parseInt(shipElement.dataset.shipSize);
    const orientation = shipElement.dataset.orientation;
    
    if (!isValidPlacement(shipElement, startX, startY)) {
      // Show fail animation
      shipElement.classList.add('fail-place');
      setTimeout(() => {
        shipElement.classList.remove('fail-place');
      }, 500);
      return false;
    }

    // Mark cells as occupied
    for (let i = 0; i < size; i++) {
      const x = orientation === 'HORIZONTAL' ? startX + i : startX;
      const y = orientation === 'VERTICAL' ? startY + i : startY;
      
      const cell = boardCells.find(c => 
        parseInt(c.dataset.x) === x && parseInt(c.dataset.y) === y
      );
      
      if (cell) {
        cell.dataset.hasShip = 'true';
        cell.classList.add('has-ship');
      }
    }

    // Mark ship as placed
    shipElement.dataset.placed = 'true';
    shipElement.classList.add('place');
    shipElement.classList.remove('active');
    shipElement.dataset.active = 'false';
    
    // Position ship on the board visually
    const targetCell = boardCells.find(c => 
      parseInt(c.dataset.x) === startX && parseInt(c.dataset.y) === startY
    );
    
    if (targetCell) {
      // Move ship to board
      boardGrid.appendChild(shipElement);
      
      // Position it over the target cell
      const cellRect = targetCell.getBoundingClientRect();
      const boardRect = boardGrid.getBoundingClientRect();
      shipElement.style.position = 'absolute';
      shipElement.style.left = `${cellRect.left - boardRect.left}px`;
      shipElement.style.top = `${cellRect.top - boardRect.top}px`;
      shipElement.style.zIndex = '2';
    }
    
    // Update status
    const statusElement = shipsList.querySelector(`.${shipElement.dataset.shipName} .ship-status`);
    if (statusElement) {
      statusElement.innerHTML = '🟢';
    }
    
    placedShips++;
    selectedShip = null;
    updateProgress();
    
    return true;
  };

  const removeShipFromBoard = (shipElement) => {
    if (shipElement.dataset.placed !== 'true') return;
    
    const size = parseInt(shipElement.dataset.shipSize);
    const orientation = shipElement.dataset.orientation;
    
    // Find ship position from style
    const left = parseInt(shipElement.style.left);
    const top = parseInt(shipElement.style.top);
    
    // Clear all board cells for this ship (simpler approach)
    boardCells.forEach(cell => {
      cell.dataset.hasShip = 'false';
      cell.classList.remove('has-ship');
    });
    
    // Reset ship
    shipElement.dataset.placed = 'false';
    shipElement.classList.remove('place');
    shipElement.style.position = '';
    shipElement.style.left = '';
    shipElement.style.top = '';
    shipElement.style.zIndex = '';
    
    // Move back to container
    shipsContainer.appendChild(shipElement);
    
    // Update status
    const statusElement = shipsList.querySelector(`.${shipElement.dataset.shipName} .ship-status`);
    if (statusElement) {
      statusElement.innerHTML = '⚪';
    }
    
    placedShips--;
    updateProgress();
    
    // Re-place remaining ships that should still be on board
    setTimeout(() => {
      shipElements.forEach(ship => {
        if (ship !== shipElement && ship.dataset.placed === 'true') {
          // Re-place this ship
          const currentCells = [];
          const shipSize = parseInt(ship.dataset.shipSize);
          const shipOrientation = ship.dataset.orientation;
          
          // Find where this ship should be based on its visual position
          const shipRect = ship.getBoundingClientRect();
          const boardRect = boardGrid.getBoundingClientRect();
          
          // Find closest cell
          let closestCell = null;
          let minDistance = Infinity;
          
          boardCells.forEach(cell => {
            const cellRect = cell.getBoundingClientRect();
            const distance = Math.sqrt(
              Math.pow(cellRect.left - shipRect.left, 2) + 
              Math.pow(cellRect.top - shipRect.top, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              closestCell = cell;
            }
          });
          
          if (closestCell) {
            const startX = parseInt(closestCell.dataset.x);
            const startY = parseInt(closestCell.dataset.y);
            
            // Mark cells for this ship
            for (let i = 0; i < shipSize; i++) {
              const x = shipOrientation === 'HORIZONTAL' ? startX + i : startX;
              const y = shipOrientation === 'VERTICAL' ? startY + i : startY;
              
              const cell = boardCells.find(c => 
                parseInt(c.dataset.x) === x && parseInt(c.dataset.y) === y
              );
              
              if (cell) {
                cell.dataset.hasShip = 'true';
                cell.classList.add('has-ship');
              }
            }
          }
        }
      });
    }, 100);
  };

  // Event listeners - original approach
  shipElements.forEach(ship => {
    ship.addEventListener('click', () => {
      selectShip(ship);
    });
  });

  // Board click to place ship
  boardCells.forEach(cell => {
    cell.addEventListener('click', (e) => {
      if (!selectedShip || selectedShip.dataset.placed === 'true') return;
      
      const x = parseInt(e.target.dataset.x);
      const y = parseInt(e.target.dataset.y);
      
      placeShipOnBoard(selectedShip, x, y);
    });
  });

  rotateButton.addEventListener('click', () => {
    if (selectedShip && selectedShip.dataset.placed === 'false') {
      const currentOrientation = selectedShip.dataset.orientation;
      const newOrientation = currentOrientation === 'VERTICAL' ? 'HORIZONTAL' : 'VERTICAL';
      selectedShip.dataset.orientation = newOrientation;
      rotateButton.dataset.rotate = newOrientation === 'horizontal' ? 'VERTICAL' : 'HORIZONTAL';
      rotateButton.textContent = `🔄 Rotate (${newOrientation})`;
    }
  });

  autoPlaceButton.addEventListener('click', () => {
    clearAllShips();
    // Trigger auto placement event
    window.dispatchEvent(new CustomEvent('autoPlaceShips'));
  });

  clearButton.addEventListener('click', () => {
    clearAllShips();
  });

  startGameButton.addEventListener('click', () => {
    if (placedShips === 5) {
      window.dispatchEvent(new CustomEvent('startAIBattle'));
    }
  });

  backButton.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('backToLobby'));
  });

  // Initialize
  updateProgress();
  if (shipElements.length > 0) {
    selectShip(shipElements[0]);
  }

  return {
    setupContainer,
    boardCells,
    shipElements,
    updateProgress,
    selectShip,
    placeShipOnBoard,
    clearAllShips,
    startGameButton,
    backButton
  };
}
