// Rock Paper Scissors game using objects and factory functions

// Game flow:
// - The user makes a choice.
// - The computer makes a choice.
// - The winner is displayed.

// Planning an object-oriented program:
// - Textual description of problem or exercise
// - Extract significant nouns and verbs from description
// - Organize and associate verbs with the nouns

// =============================================================
// =============================================================

// - A player chooses
// - What "compares"?

// Player
// - choose
// Move
// Rule

// ???
// - compare

//

/*

Possible bonus features:
- Keep score
  - First to 5 wins
  - We now have a new noun: a "score"
    - New object type? State in an existing class?
- Add lizard and spock
- Keep track of history of moves made by both human and computer as long
  as the user doesn't quit
  - What data structure to use? New object or existing object? How will we
    display it?
- Adjust computer choice based on history
  - Ex.: if human wins a high percentage of the time when computer chooses
    rock, decrease likelihood that computer will choose rock
  - Come up with an appropriate rule, do some history analysis, adjust the
    weight of each choice, then have computer consider the weight of each
    choice when choosing a move

*/

const rlSync = require('readline-sync');

function createPlayer() {
  return {
    move: null,
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    }
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors'];

      let choice;
      while (true) {
        console.log('Please choose rock, paper, or scissors:');
        choice = rlSync.question();
        if (choices.includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    }
  };

  return Object.assign(playerObject, humanObject);
}

/*

Removed `createMove`, `createRule`, and `choose` functions that we had in
our original skeleton

*/

// =============================================================

// Orchestration Engine
const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors!');
  },
  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors. Goodbye!');
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
        (humanMove === 'paper' && computerMove === 'rock') ||
        (humanMove === 'scissors' && computerMove === 'paper')) {
      console.log('You win!');
    } else if ((humanMove === 'rock' && computerMove === 'paper') ||
               (humanMove === 'paper' && computerMove === 'scissors') ||
               (humanMove === 'scissors' && computerMove === 'rock')) {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie");
    }
  },

  playAgain() {
    while (true) {
      console.log('Would you like to play again? (y/n)');
      let answer = rlSync.question();
      if (answer === 'y' || answer === 'n') {
        return answer === 'y';
      }
      console.log('Sorry, invalid choice.');
    }
  },

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  }
};

RPSGame.play();

/* eslint max-lines-per-function: */
