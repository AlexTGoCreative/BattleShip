import createElementWithClass from '../helper_module/create-element-with-class.js';

/**
 * Creates the main dashboard page after successful user registration
 * @param {string} username - Current user's username
 * @returns {Object} Dashboard elements object
 */
export function createDashboard(username) {
  // Main dashboard container
  const dashboardContainer = createElementWithClass('div', ['dashboard-container']);
  
  // Header section
  const dashboardHeader = createElementWithClass('div', ['dashboard-header']);
  
  const welcomeTitle = createElementWithClass('h1', ['dashboard-title']);
  welcomeTitle.innerHTML = `Welcome, ${username}!`;  ;
  
  const subtitle = createElementWithClass('p', ['dashboard-subtitle']);
  subtitle.textContent = 'Choose your battleship adventure';
  
  dashboardHeader.appendChild(welcomeTitle);
  dashboardHeader.appendChild(subtitle);
  
  // Game modes section
  const gameModesSection = createElementWithClass('div', ['game-modes-section']);
  
  const sectionTitle = createElementWithClass('h2', ['section-title']);
  sectionTitle.textContent = 'Game Modes';
  gameModesSection.appendChild(sectionTitle);
  
  // Game modes grid
  const gameModesGrid = createElementWithClass('div', ['game-modes-grid']);
  
  // AI Battle Card
  const aiBattleCard = createElementWithClass('div', ['game-mode-card', 'ai-battle-card']);
  aiBattleCard.innerHTML = `
    <div class="card-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
      </svg>
    </div>
    <h3 class="card-title">Battle AI</h3>
    <p class="card-description">Challenge our intelligent computer opponents</p>
    <div class="difficulty-options">
      <span class="difficulty-tag easy">Easy</span>
      <span class="difficulty-tag hard">Hard</span>
    </div>
  `;
  
  // Online Battle Card
  const onlineBattleCard = createElementWithClass('div', ['game-mode-card', 'online-battle-card']);
  onlineBattleCard.innerHTML = `
    <div class="card-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M9,11A1,1 0 0,0 8,12A1,1 0 0,0 9,13A1,1 0 0,0 10,12A1,1 0 0,0 9,11M15,11A1,1 0 0,0 14,12A1,1 0 0,0 15,13A1,1 0 0,0 16,12A1,1 0 0,0 15,11M11,14H13L12.5,15.5H11.5L11,14Z"/>
      </svg>
    </div>
    <h3 class="card-title">Online Battle</h3>
    <p class="card-description">Challenge other players in real-time</p>
    <div class="online-status">
      <span class="online-indicator"></span>
      <span class="online-count">Loading...</span>
    </div>
  `;
  
  // Tutorial Card
  const tutorialCard = createElementWithClass('div', ['game-mode-card', 'tutorial-card']);
  tutorialCard.innerHTML = `
    <div class="card-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C7.59,12 4,7.59 4,12C4,16.41 7.59,20 12,20M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
      </svg>
    </div>
    <h3 class="card-title">Tutorial</h3>
    <p class="card-description">Learn how to play Battleship</p>
    <div class="tutorial-badge">
      <span>Interactive Guide</span>
    </div>
  `;
  
  gameModesGrid.appendChild(aiBattleCard);
  gameModesGrid.appendChild(onlineBattleCard);
  gameModesGrid.appendChild(tutorialCard);
  gameModesSection.appendChild(gameModesGrid);
  
  // Online players section
  const onlinePlayersSection = createElementWithClass('div', ['online-players-section']);
  
  const playersTitle = createElementWithClass('h2', ['section-title']);
  playersTitle.textContent = 'Online Players';
  
  const playersContainer = createElementWithClass('div', ['players-container']);
  const playersList = createElementWithClass('div', ['players-list']);
  const playersCount = createElementWithClass('div', ['players-count']);
  playersCount.textContent = 'Loading players...';
  
  playersContainer.appendChild(playersCount);
  playersContainer.appendChild(playersList);
  onlinePlayersSection.appendChild(playersTitle);
  onlinePlayersSection.appendChild(playersContainer);
  
  // User actions section
  const userActionsSection = createElementWithClass('div', ['user-actions-section']);
  
  const logoutBtn = createElementWithClass('button', ['logout-btn']);
  logoutBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
    </svg>
    <span>Logout</span>
  `;
  

  userActionsSection.appendChild(logoutBtn);
  
  // Assemble dashboard
  dashboardContainer.appendChild(dashboardHeader);
  dashboardContainer.appendChild(gameModesSection);
  dashboardContainer.appendChild(onlinePlayersSection);
  dashboardContainer.appendChild(userActionsSection);
  
  return {
    dashboardContainer,
    aiBattleCard,
    onlineBattleCard,
    tutorialCard,
    playersList,
    playersCount,
    logoutBtn
  };
}

/**
 * Creates AI difficulty selection modal
 * @returns {Object} Difficulty modal elements
 */
export function createAIDifficultyModal() {
  const modal = createElementWithClass('dialog', ['ai-difficulty-modal']);
  
  const modalContent = createElementWithClass('div', ['modal-content']);
  
  // Header
  const header = createElementWithClass('div', ['modal-header']);
  const title = createElementWithClass('h2', ['modal-title']);
  title.textContent = 'Choose AI Difficulty';
  
  const closeBtn = createElementWithClass('button', ['modal-close-btn']);
  closeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
    </svg>
  `;
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Difficulty options
  const difficultyOptions = createElementWithClass('div', ['difficulty-options-container']);
  
  // Easy AI
  const easyOption = createElementWithClass('div', ['difficulty-option', 'easy-option']);
  easyOption.innerHTML = `
    <div class="difficulty-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
      </svg>
    </div>
    <h3>Easy AI</h3>
    <p>Perfect for beginners and casual play</p>
    <ul class="difficulty-features">
      <li>Random shooting patterns</li>
      <li>No strategy optimization</li>
      <li>Great for learning</li>
    </ul>
  `;
  
  // Hard AI
  const hardOption = createElementWithClass('div', ['difficulty-option', 'hard-option']);
  hardOption.innerHTML = `
    <div class="difficulty-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17M11,9H13V15H11V9Z"/>
      </svg>
    </div>
    <h3>Hard AI</h3>
    <p>For experienced players seeking a challenge</p>
    <ul class="difficulty-features">
      <li>Strategic hunting patterns</li>
      <li>Advanced ship tracking</li>
      <li>Optimized targeting</li>
    </ul>
  `;
  
  difficultyOptions.appendChild(easyOption);
  difficultyOptions.appendChild(hardOption);
  
  // Action buttons
  const actionButtons = createElementWithClass('div', ['modal-actions']);
  
  const cancelBtn = createElementWithClass('button', ['cancel-btn']);
  cancelBtn.textContent = 'Cancel';
  
  actionButtons.appendChild(cancelBtn);
  
  // Assemble modal
  modalContent.appendChild(header);
  modalContent.appendChild(difficultyOptions);
  modalContent.appendChild(actionButtons);
  modal.appendChild(modalContent);
  
  return {
    modal,
    closeBtn,
    easyOption,
    hardOption,
    cancelBtn
  };
}
