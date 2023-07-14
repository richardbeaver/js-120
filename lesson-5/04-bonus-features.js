/*

Tic-Tac-Toe Bonus Features

- Improved prompt
  - Create a `joinOr` method to add "or" before the last number in the prompt
- Play again
  - Ask user if they want to play again
  - Don'd display welcome message again if playing again
- Computer AI: Defense
  - Have it defend against an immediate available winning move for the player
- Computer AI: Offense
  - Have the computer look for an offensive winning move if one exists,
    then block potential user winning moves if computer doesn't have winning
    move for itself
- Have computer pick center square if no immediate winning moves and it's
  available
- Refactor the move methods
  - The `offensiveComputerMove` and `defensiveComputerMove` methods are nearly
    identical, as are `atRiskSquare` and `winningSquare`
  - Try to DRY up that code
- Keep Score
  - Don't use global or static variables
  - First to win 3 games wins match
  - Report current scores after each game and be clear when someone wins
    a match
- Take turns going first
  - Human and computer take turns going first in each game
  - Can keep the human and computer markers as they are

Other notes:
- Tried to implement randomly deciding who goes first in the first game of
  a match
  - If computer went first, screen was cleared after its first move, meaning
    that the user would not see the welcome message


Other challenging ideas:
- Use minimax algorithm for computer logic
  - https://en.wikipedia.org/wiki/Minimax
- Try to make a game that uses a bigger board
- Try allowing for more players in a game

*/

// Final Code with bonus features (excluding other challenging ideas):

const rlSync = require('readline-sync');

// =============================================================

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}
// `static` for class constants still new-ish
// Could move these outside class for older browsers or Node versions:

// Square.UNUSED_SQUARE = " ";
// Square.HUMAN_MARKER = "X";
// Square.COMPUTER_MARKER = "O";

// =============================================================

class Board {
  constructor() {
    this.squares = {};
    this.initialize();
  }

  initialize() {
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[counter] = new Square();
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  displayWithClear() {
    console.clear();
    console.log("");
    console.log("");
    this.display();
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter((key) => this.isUnusedSquare(key));
  }

  isUnusedSquare(key) {
    return this.squares[key].isUnused();
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter((key) => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }
}

// =============================================================

class Player {
  constructor(marker) {
    this.marker = marker;
    this.score = 0;
  }

  getMarker() {
    return this.marker;
  }

  getScore() {
    return this.score;
  }

  incrementScore() {
    this.score += 1;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

// =============================================================

class TTTGame {
  static MATCH_GOAL = 3;
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];

  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.firstPlayer = this.human;
  }

  play() {
    this.displayWelcomeMessage();
    this.playMatch();
    this.displayGoodbyeMessage();
  }

  playMatch() {
    console.log(`First player to win ${TTTGame.MATCH_GOAL} games wins the match.`);

    while (true) {
      this.playOneGame();
      this.updateMatchScore();
      this.displayMatchScore();

      if (this.matchOver()) break;
      if (!this.playAgain()) break;
      this.firstPlayer = this.alternatePlayer(this.firstPlayer);
    }

    this.displayMatchResults();
  }

  playOneGame() {
    let currentPlayer = this.firstPlayer;

    this.board.initialize();
    this.board.display();

    while (true) {
      this.playerMoves(currentPlayer);
      if (this.gameOver()) break;

      this.board.displayWithClear();
      currentPlayer = this.alternatePlayer(currentPlayer);
    }

    this.board.displayWithClear();
    this.displayResults();
  }

  playAgain() {
    let answer;

    while (true) {
      answer = rlSync.question("Play again? (y/n): ").toLowerCase();
      if (answer === 'y' || answer === 'n') break;

      console.log("Sorry that's not a valid choice");
      console.log("");
    }

    console.clear();
    return answer === 'y';
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  }

  displayMatchScore() {
    let human = this.human.getScore();
    let computer = this.computer.getScore();
    console.log(`Current match score: [you: ${human}] [computer: ${computer}]`);
  }

  displayMatchResults() {
    if (this.human.getScore() > this.computer.getScore()) {
      console.log("You won this match! Congratulations!");
    } else if (this.human.getScore() < this.computer.getScore()) {
      console.log("You lost this match! Better luck next time.");
    }
  }

  alternatePlayer(player) {
    return player === this.human ? this.computer : this.human;
  }

  playerMoves(currentPlayer) {
    if (currentPlayer === this.human) {
      this.humanMoves();
    } else {
      this.computerMoves();
    }
  }

  humanMoves() {
    let validChoices = this.board.unusedSquares();
    const prompt = `Choose square (${TTTGame.joinOr(validChoices)}): `;

    let choice;
    while (true) {
      choice = rlSync.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry that's not a valid choice");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let choice = this.offensiveComputerMove();

    if (!choice) {
      choice = this.defensiveComputerMove();
    }

    if (!choice) {
      choice = this.pickCenterSquare();
    }

    if (!choice) {
      choice = this.pickRandomSquare();
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  offensiveComputerMove() {
    return this.findWinningSquare(this.computer);
  }

  defensiveComputerMove() {
    return this.findWinningSquare(this.human);
  }

  findWinningSquare(player) {
    for (let idx = 0; idx < TTTGame.POSSIBLE_WINNING_ROWS.length; idx += 1) {
      let currentRow = TTTGame.POSSIBLE_WINNING_ROWS[idx];

      let key = this.getCriticalSquare(currentRow, player);
      if (key) return key;
    }

    return null;
  }

  getCriticalSquare(row, player) {
    if (this.board.countMarkersFor(player, row) === 2) {
      let key = row.find((key) => this.board.isUnusedSquare(key));
      if (key) return key;
    }

    return null;
  }

  pickCenterSquare() {
    return this.board.isUnusedSquare('5') ? '5' : null;
  }

  pickRandomSquare() {
    let validChoices = this.board.unusedSquares();

    let choice;
    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    return choice;
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some((row) => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  updateMatchScore() {
    if (this.isWinner(this.human)) {
      this.human.incrementScore();
    } else if (this.isWinner(this.computer)) {
      this.computer.incrementScore();
    }
  }

  matchOver() {
    return this.isMatchWinner(this.human) || this.isMatchWinner(this.computer);
  }

  isMatchWinner(player) {
    return player.getScore() >= TTTGame.MATCH_GOAL;
  }

  static joinOr(choices, separator = ', ', conjunction = 'or') {
    if (choices.length === 0) return '';
    if (choices.length === 1) return String(choices[0]);

    if (choices.length === 2) {
      return choices.join(` ${conjunction} `);
    }

    let lastChoice = choices.at(-1);
    let otherChoices = choices.slice(0, -1).join(separator);
    return `${otherChoices}${separator}${conjunction} ${lastChoice}`;
  }
}

// =============================================================

let game = new TTTGame();
game.play();

// =============================================================
// =============================================================

// Tests for `joinOr` from bonus features:
// console.log(
//   TTTGame.joinOr([1, 2])                  === "1 or 2",
//   TTTGame.joinOr([1, 2, 3])               === "1, 2, or 3",
//   TTTGame.joinOr([1, 2, 3], '; ')         === "1; 2; or 3",
//   TTTGame.joinOr([1, 2, 3], ', ', 'and')  === "1, 2, and 3",
// );
