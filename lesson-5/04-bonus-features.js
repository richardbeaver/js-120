/*

Potential bonus features:

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

Other challenging ideas:
- Use minimax algorithm for computer logic
  - https://en.wikipedia.org/wiki/Minimax
- Try to make a game that uses a bigger board
- Try allowing for more players in a game

*/
