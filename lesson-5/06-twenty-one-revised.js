/*

Differences in this solution from original solution:

- Replace `Participant` super-class, from which `Player` and `Dealer`
  inherit, with a `Hand` mixin to provide the functionality of having a
  hand of cards
  - An array of cards is the only state property used by both `Player` and
    `Dealer`
    - Using the `resetHand` method to initialize the `cards` property, which
      can now also part of the `Hand` mix-in
  - Makes more sense to obtain their shared behavior from a mix-in than from
    an inheritance relationship with a common super-class that holds no
    state properties of its own

- Replace 21 and 17 with `TARGET_SCORE` and `DEALER_MUST_STAY_SCORE` static
  constants in `TwentyOneGame` class
  - Move methods for computing score and for checking if a hand has busted
    from `Participant` class to `TwentyOneGame` class so they have access
    to these constants since we'd like to define `Player`/`Dealer` classes first
    - These two methods now take `hand` parameters, and call methods on
      `Player` and `Dealer` instances inherited from the `Hand` mixin

- Replace player's starting and winning dollar amounts with `INITIAL_PURSE` and
  `WINNING_PURSE` static constants in `Player` class

- Move lower level methods into methods meant to exist at a higher level of
  abstraction, rather than existing in the same level
  - Ex.: resetting the deck/players' hands inside of `play`, which also
    called `playOneGame`
    - Setting deck/hands can be done inside `playOneGame`, removing this lower
      level method behavior from being called in the same scope as the higher
      level `playOneGame`
  - Ex.: clearing the console as first step of `start` method, then calling
    `displayWelcomeMessage` right after
    - Clearing the console is a very different level than other steps inside
      `start`, and can be done as part of displaying the welcome message

- Don't add a new `Deck` as an instance property of the `TwentyOneGame` class
  in its constructor
  - Add this in the `dealCards` method to create a new deck at the start of
    each new game

- In static properties of `Card`, `SUITS` and `RANKS`, use full names of suits
  and face cards rather than first letters
  - Makes meanings explicit
  - Don't rely on single-letter abbreviations of specific knowledge terms

- During the dealer's turn, pause between each card dealt to the dealer's
  hand (user presses Return to continue to next card dealt)

- Move string represenation of hidden card to static property of `Card` class
  to use in the `Card` `toString` instance method

*/

const rlSync = require('readline-sync');
const shuffleArray = require('shuffle-array');

// =============================================================

class Card {
  static SUITS = ["Clubs", "Diamonds", "Hearts", "Spades"];
  static RANKS = [
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"
  ];
  static HIDDEN_CARD = '[ --- ]';

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.hidden = false;
  }

  toString() {
    if (this.isHidden()) return Card.HIDDEN_CARD;
    return `[ ${this.getRank()}-${this.getSuit()}] `;
  }

  getRank() {
    return this.rank;
  }

  getSuit() {
    return this.suit;
  }

  isHidden() {
    return this.hidden;
  }

  hide() {
    this.hidden = true;
  }

  reveal() {
    this.hidden = false;
  }

  isAce() {
    return this.getRank() === "Ace";
  }

  isFaceCard() {
    return this.getRank() === "Jack"
      || this.getRank() === "Queen"
      || this.getRank() === "King";
  }
}

// =============================================================

class Deck {
  constructor () {
    this.cards = [];

    Card.SUITS.forEach((suit) => {
      Card.RANKS.forEach((rank) => {
        this.cards.push(new Card(suit, rank));
      });
    });

    this.shuffleCards();
  }

  shuffleCards() {
    shuffleArray(this.cards);
  }

  dealCardFaceUp() {
    return this.cards.pop();
  }

  dealCardFaceDown() {
    let card = this.dealCardFaceUp();
    card.hide();
    return card;
  }
}

// =============================================================

const Hand = {
  resetHand() {
    this.cards = [];
  },

  getCards() {
    return this.cards;
  },

  addToHand(card) {
    this.cards.push(card);
  },

  showHand(caption) {
    console.log(caption);
    console.log("");

    this.cards.forEach((card) => console.log(`  ${card}`));
    console.log("");
  },

  revealAllCards () {
    this.cards.forEach((card) => card.reveal());
  },
};

// =============================================================

class Player {
  static INITIAL_PURSE = 5;
  static WINNING_PURSE = 2 * Player.INITIAL_PURSE;

  constructor() {
    this.money = Player.INITIAL_PURSE;
    this.resetHand();
  }

  isBroke() {
    return this.money <= 0;
  }

  isRich() {
    return this.money >= Player.WINNING_PURSE;
  }

  winBet() {
    this.money += 1;
  }

  loseBet() {
    this.money -= 1;
  }

  showPurse() {
    console.log(`You have $${this.money}`);
    console.log("");
  }
}

Object.assign(Player.prototype, Hand);

// =============================================================

class Dealer {
  constructor() {
    this.resetHand();
  }
}

Object.assign(Dealer.prototype, Hand);

// =============================================================
// =============================================================

class TwentyOneGame {
  static TARGET_SCORE = 21;
  static DEALER_MUST_STAY_SCORE = this.TARGET_SCORE - 4;
  static HIT = 'h';
  static STAY = 's';

  constructor() {
    this.player = new Player();
    this.dealer = new Dealer();
  }

  start() {
    this.displayWelcomeMessage();

    while (true) {
      this.playOneGame();
      if (this.player.isBroke() || this.player.isRich()) break;
      if (!this.playAgain()) break;
    }

    if (this.player.isBroke()) {
      console.log("You're broke!");
    } else if (this.player.isRich()) {
      console.log("You're rich!");
    }

    this.displayGoodByeMessage();
  }

  playAgain() {
    let answer;
    while (true) {
      answer = rlSync.question("Play again? (y/n): ").toLowerCase();
      if (['y', 'n'].includes(answer)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    console.clear();
    return answer === 'y';
  }

  playOneGame() {
    this.dealCards();
    this.showCards();
    this.player.showPurse();
    this.playerTurn();

    if (!this.isBusted(this.player)) {
      this.dealerTurn();
    }

    console.clear();
    this.showCards();
    this.displayResult();

    this.updatePurse();
    this.player.showPurse();
  }

  dealCards() {
    this.deck = new Deck();
    this.player.resetHand();
    this.dealer.resetHand();

    this.player.addToHand(this.deck.dealCardFaceUp());
    this.dealer.addToHand(this.deck.dealCardFaceUp());
    this.player.addToHand(this.deck.dealCardFaceUp());
    this.dealer.addToHand(this.deck.dealCardFaceDown());
  }

  showCards() {
    this.dealer.showHand("Dealer's Cards");
    this.showScoreFor(this.dealer);

    this.player.showHand("Your Cards");
    this.showScoreFor(this.player);
  }

  playerTurn() {
    while (this.hitOrStay() === TwentyOneGame.HIT) {
      this.hit(this.player);
      if (this.isBusted(this.player)) break;
    }
  }

  hitOrStay() {
    let answer;
    while (true) {
      answer = rlSync.question("Hit or stay? (h/s): ").toLowerCase();
      if ([TwentyOneGame.HIT, TwentyOneGame.STAY].includes(answer)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    return answer;
  }

  hit(player) {
    player.addToHand(this.deck.dealCardFaceUp());
    if (this.isBusted(player)) return;

    console.clear();
    this.showCards();
  }

  dealerTurn() {
    this.dealer.revealAllCards();

    console.clear();
    this.showCards();

    while (true) {
      let score = this.computeScoreFor(this.dealer);
      if (score >= TwentyOneGame.DEALER_MUST_STAY_SCORE) break;
      this.dealerContinue();
      this.hit(this.dealer);
    }
  }

  dealerContinue() {
    rlSync.question("Press Return to continue...");
  }

  isBusted(player) {
    return this.computeScoreFor(player) > TwentyOneGame.TARGET_SCORE;
  }

  computeScoreFor(player) {
    let cards = player.getCards();
    let score = cards.reduce((total, card) => total + this.valueOf(card), 0);

    cards.filter((card) => card.isAce() && !card.isHidden())
      .forEach((_ace) => {
        if (score > TwentyOneGame.TARGET_SCORE) {
          score -= 10;
        }
      });

    return score;
  }

  valueOf(card) {
    if (card.isHidden())   return 0;
    if (card.isAce())      return 11;
    if (card.isFaceCard()) return 10;
    return parseInt(card.getRank(), 10);
  }

  showScoreFor(player) {
    console.log(`  Points: ${this.computeScoreFor(player)}`);
    console.log("");
  }

  updatePurse() {
    let winner = this.whoWon();
    if (winner === this.player) {
      this.player.winBet();
    } else if (winner === this.dealer) {
      this.player.loseBet();
    }
  }

  whoWon() {
    if (this.isBusted(this.player)) return this.dealer;
    if (this.isBusted(this.dealer)) return this.player;

    let playerScore = this.computeScoreFor(this.player);
    let dealerScore = this.computeScoreFor(this.dealer);

    if (playerScore > dealerScore) return this.player;
    if (playerScore < dealerScore) return this.dealer;
    return null;  // tie game
  }

  displayResult() {
    if (this.isBusted(this.player)) {
      console.log("You busted! Dealer wins.");
    } else if (this.isBusted(this.dealer)) {
      console.log("Dealer busted! You win.");
    } else {
      let playerScore = this.computeScoreFor(this.player);
      let dealerScore = this.computeScoreFor(this.dealer);

      if (playerScore > dealerScore) {
        console.log("You win!");
      } else if (playerScore < dealerScore) {
        console.log("Dealer wins!");
      } else {
        console.log("Tie game.");
      }
    }
    console.log("");
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to 21!");
    console.log("");
  }

  displayGoodByeMessage() {
    console.log("Thanks for playing 21! Goodbye!");
  }
}

// =============================================================

let game = new TwentyOneGame();
game.start();
