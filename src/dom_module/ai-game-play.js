import createElementWithClass from '../helper_module/create-element-with-class.js';
import { reverseTransform } from '../helper_module/number-transform.js';
import GAME_SETTINGS from '../GAME_SETTINGS/game-settings.js';

const { BOARD_SPECS } = GAME_SETTINGS;
const { BOARD_X_SIZE } = BOARD_SPECS;

export default function createAIGamePlayPage() {
  const gamePlayContainer = createElementWithClass('div', [
    'ai-game-play',
    'full-height',
    'padding_2r'
  ]);

  // Header
  const header = createElementWithClass('header', [
    'game-header',
    'd-flex',
    'justify-content__between',
    'align-items__center',
    'margin-bottom_2r'
  ]);

  const gameTitle = createElementWithClass('h2', [
    'game-title',
    'text-gradient'
  ]);
  gameTitle.textContent = 'Battle in Progress';

  const gameStatus = createElementWithClass('div', [
    'game-status',
    'glass-card',
    'padding_1r'
  ]);

  const statusText = createElementWithClass('span', [
    'status-text'
  ]);
  statusText.textContent = 'Your Turn';

  const turnIndicator = createElementWithClass('div', [
    'turn-indicator',
    'active'
  ]);

  gameStatus.appendChild(statusText);
  gameStatus.appendChild(turnIndicator);

  header.appendChild(gameTitle);
  header.appendChild(gameStatus);

  // Main game area
  const gameMain = createElementWithClass('main', [
    'game-main',
    'd-flex',
    'gap_2r',
    'justify-content__center'
  ]);

  // Player section (left)
  const playerSection = createElementWithClass('section', [
    'player-section',
    'glass-card'
  ]);

  const playerHeader = createElementWithClass('div', [
    'section-header',
    'text-align__center',
    'margin-bottom_1r'
  ]);

  const playerTitle = createElementWithClass('h3', [
    'section-title'
  ]);
  playerTitle.innerHTML = '👤 Your Fleet';

  const playerStatus = createElementWithClass('div', [
    'player-status'
  ]);
  playerStatus.textContent = 'Ships: 5/5';

  playerHeader.appendChild(playerTitle);
  playerHeader.appendChild(playerStatus);

  // Player board
  const playerBoard = createElementWithClass('div', [
    'game-board'
  ]);

  const playerRowLabels = createElementWithClass('div', [
    'row-labels',
    'gap_2',
    'centered_flex'
  ]);

  const playerColLabels = createElementWithClass('div', [
    'col-labels',
    'gap_2',
    'centered_flex'
  ]);

  const playerBoardGrid = createElementWithClass('div', [
    'board-grid',
    'gap_2'
  ]);

  // Create player board cells
  const playerBoardCells = [];
  for (let i = 0; i < BOARD_X_SIZE * BOARD_X_SIZE; i += 1) {
    const cell = createElementWithClass('button', [
      'board-cell',
      'player-cell'
    ]);
    const [x, y] = reverseTransform(i, BOARD_X_SIZE);
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.dataset.hasShip = 'false';
    cell.dataset.mask = 'false';
    playerBoardGrid.appendChild(cell);
    playerBoardCells.push(cell);
  }

  // Create player labels
  for (let i = 0; i < BOARD_X_SIZE; i += 1) {
    const rowLabel = createElementWithClass('div', [
      'label-item',
      'centered_flex'
    ]);
    rowLabel.textContent = String.fromCharCode(i + 65);
    playerRowLabels.appendChild(rowLabel);

    const colLabel = createElementWithClass('div', [
      'label-item',
      'centered_flex'
    ]);
    colLabel.textContent = (i + 1).toString();
    playerColLabels.appendChild(colLabel);
  }

  playerBoard.appendChild(playerRowLabels);
  playerBoard.appendChild(playerColLabels);
  playerBoard.appendChild(playerBoardGrid);

  playerSection.appendChild(playerHeader);
  playerSection.appendChild(playerBoard);

  // AI section (right)
  const aiSection = createElementWithClass('section', [
    'ai-section',
    'glass-card'
  ]);

  const aiHeader = createElementWithClass('div', [
    'section-header',
    'text-align__center',
    'margin-bottom_1r'
  ]);

  const aiTitle = createElementWithClass('h3', [
    'section-title'
  ]);
  aiTitle.innerHTML = '🤖 Enemy Fleet';

  const aiStatus = createElementWithClass('div', [
    'ai-status'
  ]);
  aiStatus.textContent = 'Ships: 5/5';

  aiHeader.appendChild(aiTitle);
  aiHeader.appendChild(aiStatus);

  // AI board (target board)
  const aiBoard = createElementWithClass('div', [
    'game-board'
  ]);

  const aiRowLabels = createElementWithClass('div', [
    'row-labels',
    'gap_2',
    'centered_flex'
  ]);

  const aiColLabels = createElementWithClass('div', [
    'col-labels',
    'gap_2',
    'centered_flex'
  ]);

  const aiBoardGrid = createElementWithClass('div', [
    'board-grid',
    'gap_2'
  ]);

  // Create AI board cells (these are clickable for attacks)
  const aiBoardCells = [];
  for (let i = 0; i < BOARD_X_SIZE * BOARD_X_SIZE; i += 1) {
    const cell = createElementWithClass('button', [
      'board-cell',
      'ai-cell',
      'cursor_pointer'
    ]);
    const [x, y] = reverseTransform(i, BOARD_X_SIZE);
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.dataset.hasShip = 'false';
    cell.dataset.attacked = 'false';
    aiBoardGrid.appendChild(cell);
    aiBoardCells.push(cell);
  }

  // Create AI labels
  for (let i = 0; i < BOARD_X_SIZE; i += 1) {
    const rowLabel = createElementWithClass('div', [
      'label-item',
      'centered_flex'
    ]);
    rowLabel.textContent = String.fromCharCode(i + 65);
    aiRowLabels.appendChild(rowLabel);

    const colLabel = createElementWithClass('div', [
      'label-item',
      'centered_flex'
    ]);
    colLabel.textContent = (i + 1).toString();
    aiColLabels.appendChild(colLabel);
  }

  aiBoard.appendChild(aiRowLabels);
  aiBoard.appendChild(aiColLabels);
  aiBoard.appendChild(aiBoardGrid);

  aiSection.appendChild(aiHeader);
  aiSection.appendChild(aiBoard);

  gameMain.appendChild(playerSection);
  gameMain.appendChild(aiSection);

  // Footer controls
  const footer = createElementWithClass('footer', [
    'game-footer',
    'd-flex',
    'justify-content__between',
    'align-items__center',
    'margin-top_2r'
  ]);

  const gameInfo = createElementWithClass('div', [
    'game-info',
    'glass-card',
    'padding_1r'
  ]);

  const gameInfoText = createElementWithClass('span', [
    'game-info-text'
  ]);
  gameInfoText.textContent = 'Click on enemy board to attack';

  gameInfo.appendChild(gameInfoText);

  const gameControls = createElementWithClass('div', [
    'game-controls',
    'd-flex',
    'gap_1r'
  ]);

  const homeButton = createElementWithClass('button', [
    'btn-secondary',
    'cursor_pointer'
  ]);
  homeButton.innerHTML = '🏠 Home';

  const surrenderButton = createElementWithClass('button', [
    'btn-danger',
    'cursor_pointer'
  ]);
  surrenderButton.innerHTML = '🏳️ Surrender';

  gameControls.appendChild(homeButton);
  gameControls.appendChild(surrenderButton);

  footer.appendChild(gameInfo);
  footer.appendChild(gameControls);

  gamePlayContainer.appendChild(header);
  gamePlayContainer.appendChild(gameMain);
  gamePlayContainer.appendChild(footer);

  return {
    gamePlayContainer,
    playerBoardCells,
    aiBoardCells,
    statusText,
    turnIndicator,
    playerStatus,
    aiStatus,
    gameInfoText,
    homeButton,
    surrenderButton
  };
}
