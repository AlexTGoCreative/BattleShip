import GameRound from './game-round.js';
import socketClient from './services/socket-client.js';

export default class MultiplayerGameController {
  #GAME_ROUND = null;
  #ROUND_START = false;
  #GAME_ID = null;
  #IS_PLAYER_1 = false;
  #OPPONENT_USERNAME = null;

  constructor(gameId, isPlayer1, opponentUsername) {
    this.#GAME_ID = gameId;
    this.#IS_PLAYER_1 = isPlayer1;
    this.#OPPONENT_USERNAME = opponentUsername;
    this.#GAME_ROUND = new GameRound();
  }

  get gameId() {
    return this.#GAME_ID;
  }

  get isPlayer1() {
    return this.#IS_PLAYER_1;
  }

  get opponentUsername() {
    return this.#OPPONENT_USERNAME;
  }

  // Ship placement methods (same as original)
  placeHumanPlayerCarrier(x, y, orientation) {
    if (!this.#ROUND_START) return false;
    return this.#GAME_ROUND.placeHumanPlayerCarrier(x, y, orientation);
  }

  placeHumanPlayerBattleShip(x, y, orientation) {
    if (!this.#ROUND_START) return false;
    return this.#GAME_ROUND.placeHumanPlayerBattleShip(x, y, orientation);
  }

  placeHumanPlayerDestroyer(x, y, orientation) {
    if (!this.#ROUND_START) return false;
    return this.#GAME_ROUND.placeHumanPlayerDestroyer(x, y, orientation);
  }

  placeHumanPlayerSubMarine(x, y, orientation) {
    if (!this.#ROUND_START) return false;
    return this.#GAME_ROUND.placeHumanPlayerSubMarine(x, y, orientation);
  }

  placeHumanPlayerPatrolBoat(x, y, orientation) {
    if (!this.#ROUND_START) return false;
    return this.#GAME_ROUND.placeHumanPlayerPatrolBoat(x, y, orientation);
  }

  autoPlaceHumanPlayerShips() {
    if (!this.#ROUND_START) return;
    this.#GAME_ROUND.autoPlaceHumanShips();
  }

  // In multiplayer, we don't control bot ships - they're the opponent's ships
  autoPlaceBotShips() {
    if (!this.#ROUND_START) return;
    // This would be handled by the opponent's client
    this.#GAME_ROUND.autoPlaceBotShips();
  }

  get humanPlayerDetails() {
    if (!this.#ROUND_START) return false;
    return this.#GAME_ROUND.humanPlayerDetails();
  }

  get botPlayerDetails() {
    if (!this.#ROUND_START) return false;
    return this.#GAME_ROUND.botPlayerDetails();
  }

  humanPlayerShipDetails() {
    return this.#GAME_ROUND.humanPlayerShipDetails();
  }

  botPlayerShipDetails() {
    return this.#GAME_ROUND.botShipDetails();
  }

  get roundState() {
    const state = this.#GAME_ROUND.roundState;
    const { canPlayRound } = this.#GAME_ROUND;

    return {
      ...state,
      canPlayRound,
    };
  }

  getActivePlayer() {
    if (!this.#ROUND_START) return {};
    return this.#GAME_ROUND.getActivePlayer();
  }

  // Multiplayer-specific move methods
  makeMove(x, y) {
    if (!this.#ROUND_START) return false;

    const { roundWon } = this.roundState;
    if (roundWon) return {};

    // Send move to server
    const move = { x, y, timestamp: Date.now() };
    socketClient.makeGameMove(this.#GAME_ID, move);

    // Process the move locally
    const hitStatus = this.#GAME_ROUND.humanPlayerMove(x, y);
    return hitStatus;
  }

  // Process opponent's move
  processOpponentMove(x, y) {
    if (!this.#ROUND_START) return false;

    const { roundWon } = this.roundState;
    if (roundWon) return {};

    // Process as if it were a computer move against human player
    const hitStatus = this.#GAME_ROUND.botMove();
    return hitStatus;
  }

  // Ready state management
  setPlayerReady() {
    if (!this.#ROUND_START) return false;
    
    // Check if all ships are placed
    const shipDetails = this.humanPlayerShipDetails();
    const allShipsPlaced = Object.values(shipDetails).every(ship => ship.isOnBoard);
    
    if (!allShipsPlaced) {
      throw new Error('All ships must be placed before ready');
    }

    socketClient.setPlayerReady(this.#GAME_ID);
    return true;
  }

  // Game state management
  startRound() {
    this.#GAME_ROUND = new GameRound();
    this.#GAME_ROUND.addBotPlayer(); // Represents opponent
    this.#GAME_ROUND.addHumanPlayer(); // Local player
    this.#ROUND_START = true;
  }

  endRound() {
    this.#ROUND_START = false;
  }

  // Utility methods
  isMyTurn(currentPlayerUsername) {
    const myUsername = socketClient.getCurrentUser();
    return currentPlayerUsername === myUsername;
  }

  getMyShipsPlacedCount() {
    const shipDetails = this.humanPlayerShipDetails();
    return Object.values(shipDetails).filter(ship => ship.isOnBoard).length;
  }

  areAllShipsPlaced() {
    return this.getMyShipsPlacedCount() === 5;
  }

  // Game end methods
  declareVictory() {
    socketClient.endGame(this.#GAME_ID, socketClient.getCurrentUser());
  }

  // Statistics and game info
  getGameStats() {
    const humanDetails = this.humanPlayerShipDetails();
    const botDetails = this.botPlayerShipDetails();
    
    const myShipsSunk = Object.values(humanDetails).filter(ship => ship.isSunk).length;
    const opponentShipsSunk = Object.values(botDetails).filter(ship => ship.isSunk).length;
    
    return {
      gameId: this.#GAME_ID,
      isPlayer1: this.#IS_PLAYER_1,
      opponent: this.#OPPONENT_USERNAME,
      myShipsSunk,
      opponentShipsSunk,
      totalShips: 5,
      gameInProgress: this.#ROUND_START && !this.roundState.roundWon
    };
  }

  // Sync methods for real-time updates
  syncShipPlacement(shipType, x, y, orientation) {
    // This would be called when we want to sync ship placement with server
    // For now, we handle placement locally and send ready state when done
    return true;
  }

  syncGameState(serverGameState) {
    // Update local game state based on server state
    // This could be used for game recovery or sync after disconnection
    if (serverGameState.currentTurn) {
      // Update whose turn it is
      const isMyTurn = this.isMyTurn(serverGameState.currentTurn);
      return { isMyTurn, currentTurn: serverGameState.currentTurn };
    }
    return null;
  }

  // Error handling and recovery
  handleConnectionLoss() {
    // Pause the game or show reconnection UI
    console.log('Connection lost - game paused');
  }

  handleReconnection() {
    // Resume the game and sync state
    console.log('Reconnected - syncing game state');
    // Could request current game state from server here
  }

  // Cleanup
  cleanup() {
    this.endRound();
    this.#GAME_ID = null;
    this.#IS_PLAYER_1 = false;
    this.#OPPONENT_USERNAME = null;
  }
}

// Helper functions for multiplayer game events
export const MultiplayerGameEvents = {
  GAME_START: 'game_start',
  PLAYER_READY: 'player_ready',
  MOVE_MADE: 'move_made',
  GAME_END: 'game_end',
  PLAYER_DISCONNECT: 'player_disconnect',
  SHIP_SUNK: 'ship_sunk',
  TURN_CHANGE: 'turn_change'
};

// Multiplayer game utility functions
export const MultiplayerUtils = {
  validateMove: (x, y, gameBoard) => {
    if (x < 0 || x >= 10 || y < 0 || y >= 10) {
      return { valid: false, reason: 'Move out of bounds' };
    }
    
    // Check if cell was already hit
    const cellHit = gameBoard.some(cell => 
      cell.x === x && cell.y === y && cell.hit
    );
    
    if (cellHit) {
      return { valid: false, reason: 'Cell already hit' };
    }
    
    return { valid: true };
  },

  calculateGameProgress: (playerShips, opponentShips) => {
    const playerShipsSunk = playerShips.filter(ship => ship.sunk).length;
    const opponentShipsSunk = opponentShips.filter(ship => ship.sunk).length;
    
    return {
      playerProgress: (playerShipsSunk / 5) * 100,
      opponentProgress: (opponentShipsSunk / 5) * 100,
      isGameOver: playerShipsSunk === 5 || opponentShipsSunk === 5,
      winner: playerShipsSunk === 5 ? 'opponent' : (opponentShipsSunk === 5 ? 'player' : null)
    };
  },

  formatGameTime: (startTime) => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};
