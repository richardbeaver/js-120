/*

Twenty-One Game


Card game with a dealer and a player
The participants try to get as close to 21 as possible without going over
Game starts by dealing two cards from a 52-card deck, consisting of cards from
4 suits of 13 ranks each
Both participants receive 2 cards
  - Dealer hides one card face down so player can't see what it is
  - Player can see both of their cards

Player goes first
Chooses to hit or stay
  - hit: gets another card, and again can hit or stay
If score goes above 21, they bust
If player stays, dealer plays next

If the player didn't bust, it's now the dealer's turn
Dealer reveals face-down card
If dealer's points are less than 17, they must hit
If dealer goes over 21, they bust
If dealer has 17 points or more, they stay

Determine results of game


Nouns and Verbs

Nouns:
- Game, player, dealer, turn, deck, card, suit, rank, score, points
Verbs:
- Start, deal, hit, stay, win, lose, tie, bust, hide, reveal


Organize

Game
- start

Deck
- deal (here, or in dealer?)

Card
- Suit (n)
- Rank (n)

Player
- hit
- stay
- bust (state)
- Score (n, state)

Dealer
- hit
- stay
- bust
- Score (n, state)

Turn

Points

================================================

Additional Requirements:

- Welcome player to the game and say goodbye when they quit
- Each time player has an opportunity to hit or stay:
  - Display computer's hand with one card hidden
  - Display player's hand and point total
- After each game, ask player if they want to play again
- At start of program, give player $5
  - Win/lose $1 for each game won/lost
  - End program when they lose all money or reach $10
- Be prepared to run out of cards
  - Either create a new deck for each game or track cards used and create a
    new deck as needed

*/

const rlSync = require('readline-sync');
const shuffleArray = require('shuffle-array');

// =============================================================

class Participant {
  constructor() {
    this.cards = [];
    this.money = 5;
  }

  displayHand() {
    console.log(this.cards.map((card) => card.toString()).join(" "));
    console.log("");
  }

  moneyLeft() {
    return this.money;
  }

  outOfMoney() {
    return this.money <= 0;
  }

  winsGame() {
    return this.money >= 10;
  }

  winDollar() {
    this.money += 1;
  }

  loseDollar() {
    this.money -= 1;
  }

  addCard(card) {
    this.cards.push(card);
  }

  getScore() {
    let score = 0;
    this.cards.forEach((card) => {
      score += card.numberValue();
    });

    let idx = 0;
    while (score > 21 && idx < this.cards.length) {
      if (this.cards[idx].isAce()) {
        score -= 10;
      }
      idx += 1;
    }

    return score;
  }

  busted() {
    return this.getScore() > 21;
  }

  clearHand() {
    this.cards = [];
  }
}

// =============================================================

class Dealer extends Participant {
  displayHand() {
    console.log("Dealer's hand:");
    super.displayHand();
  }

  displayOneCard() {
    const HIDDEN_CARD = '[ --- ]';

    console.log(`Dealer's hand:`);
    console.log(`${this.cards.at(0).toString()} ${HIDDEN_CARD}`);
    console.log("");
  }
}

// =============================================================

class Player extends Participant {
  displayHand() {
    console.log('Your hand:');
    super.displayHand();
  }

  displayScore() {
    console.log(`Your score: ${this.getScore()}`);
    console.log("");
  }
}

// =============================================================

class Card {
  static VALUES = [
    'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
  ];
  static SUITS = ['C', 'D', 'H', 'S'];

  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  numberValue() {
    if (this.isAce()) return 11;
    if (this.isFaceCard()) return 10;
    return Number(this.value);
  }

  toString() {
    return `[ ${this.value}-${this.suit} ]`;
  }

  isAce() {
    return this.value === 'A';
  }

  isFaceCard() {
    return ['J', 'Q', 'K'].includes(this.value);
  }
}

// =============================================================

class Deck {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.cards = [];

    Card.VALUES.forEach((value) => {
      Card.SUITS.forEach((suit) => {
        this.cards.push(new Card(value, suit));
      });
    });

    this.shuffle();
  }

  shuffle() {
    shuffleArray(this.cards);
  }

  pullOneCard() {
    return this.cards.pop();
  }

}

// =============================================================
// =============================================================

class TwentyOneGame {
  constructor() {
    this.deck = new Deck();
    this.player = new Player();
    this.dealer = new Dealer();
  }

  play() {
    console.clear();
    this.displayWelcomeMessage();

    while (true) {
      this.playOneGame();
      if (this.player.outOfMoney() || this.player.winsGame()) break;
      if (!this.playAgain()) break;

      this.resetCards();
      console.clear();
    }

    if (this.player.outOfMoney()) {
      this.displayOutOfMoneyMessage();
    } else if (this.player.winsGame()) {
      this.displayPlayerWinsGameMessage();
    }

    this.displayGoodbyeMessage();
  }

  playOneGame() {
    this.dealStartingHand(this.player);
    this.dealStartingHand(this.dealer);

    this.playerTurn();

    if (!this.player.busted()) {
      this.dealerTurn();
    }

    this.adjustPlayerBalance();
    this.displayResults();
  }

  displayWelcomeMessage() {
    console.log('Welcome to Twenty-One!\n');
  }
  displayGoodbyeMessage() {
    console.log('Thanks for playing!\n');
  }

  displayOutOfMoneyMessage() {
    console.log("Uh-oh. You're out of money!");
  }
  displayPlayerWinsGameMessage() {
    console.log("Congratulations. You win!");
  }

  displayGameState() {
    this.dealer.displayOneCard();
    this.player.displayHand();
    this.player.displayScore();
  }

  displayResultingState() {
    this.dealer.displayHand();
    this.player.displayHand();
    this.player.displayScore();
  }

  displayResults() {
    console.clear();
    this.displayResultingState();

    if (this.player.busted()) {
      console.log("You busted... Dealer wins.\n");
    } else if (this.dealer.busted()) {
      console.log("Dealer busted. You win!");
    } else {

      console.log(`Dealer score: ${this.dealer.getScore()}`);

      if (this.isWinner(this.dealer)) {
        console.log('Dealer wins!');
      } else if (this.isWinner(this.player)) {
        console.log('You win!');
      } else {
        console.log("It's a tie!");
      }
    }

    console.log(`You have $${this.player.moneyLeft()} left.`);
    console.log("");
  }

  adjustPlayerBalance() {
    if (this.isWinner(this.player)) {
      this.player.winDollar();
    } else if (this.isWinner(this.dealer)) {
      this.player.loseDollar();
    }
  }

  playAgain() {
    let choice;
    while (true) {
      choice = rlSync.question('Play again? (y/n): ').toLowerCase();
      if (choice === 'y' || choice === 'n') break;

      console.log("Sorry, that's not a valid option.");
      console.log("");
    }

    return choice === 'y';
  }

  resetCards() {
    this.deck.initialize();
    this.player.clearHand();
    this.dealer.clearHand();
  }

  //

  dealStartingHand(player) {
    this.dealCard(player);
    this.dealCard(player);
  }

  dealCard(player) {
    let card = this.deck.pullOneCard();
    player.addCard(card);
  }

  playerTurn() {
    while (true) {
      console.clear();
      this.displayGameState();

      if (this.player.busted()) break;

      let choice = this.playerChoose();
      if (choice === 'stay') break;

      this.dealCard(this.player);
    }
  }

  playerChoose() {
    let choice;
    while (true) {
      choice = rlSync.question('Do you want to hit or stay? (hit/stay): ');
      if (choice === 'hit' || choice === 'stay') break;

      console.log("Sorry, that's not a valid choice");
      console.log("");
    }
    return choice;
  }

  dealerTurn() {
    while (this.dealer.getScore() < 17) {
      this.dealCard(this.dealer);
    }
  }

  isWinner(participant) {
    let otherPlayer = participant === this.player ? this.dealer : this.player;

    if (participant === this.dealer && otherPlayer.getScore() > 21) return true;

    return (participant.getScore() <= 21
            && participant.getScore() > otherPlayer.getScore())
      || (otherPlayer.busted());
  }
}

// =============================================================

let game = new TwentyOneGame();
game.play();
