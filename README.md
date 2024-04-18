# Retro 8-bit Style Snake Game

This project was a fun and challenging opportunity to learn and apply Angular for the first time. I hope you enjoy playing and testing it as much as I enjoyed making it!

## Game Features

### Gameplay

The player controls a snake on a bordered plane, populated with food items that replenish every time one is eaten. The snake moves forward one step in its current direction every set amount of time.

### Controls

The game can be controlled using the WASD keys or the Arrow keys:

- W = ArrowUp -> change direction up
- A = ArrowLeft -> change direction left
- S = ArrowDown -> change direction down
- D = ArrowRight -> change direction right

The game can be paused by pressing the Space bar.

### Snake

The snake continually gets longer as it eats food items.

### Food

There are different types of food:

- Cherries🍒(that look more like grapes😅): 100 points
- Mushrooms🍄: 350 points, inverts controls for 30 seconds, and enables "trippy"🕺🪩 lights!
- Pizza🍕: 400 points, makes the snake move faster (to burn the calories)🏃

Every time the snake eats, a new food item spawns on an available spot within the plane.

### End Game

The game ends once the snake collides with itself or the border of the plane. A "game over" overlay appears for user to restart the game.

### Score Tracking

The player can track the score within the game.

### Restart

When the game ends, the player can restart the game.

### Implementation

The game is implemented in TypeScript and rendered using SVG. Animations are used to enhance the gaming experience. D3 is used where deemed applicable.

### Unit Tests

Unit tests have been written for high-risk components.

### Responsiveness

The game is responsive but due to the grid size needing to be updated there is a listener that triggers a flag which then enables an overlay
to prompt the user to refresh so the grid can be realigned to the correct window dimensions.
Mobile controls were also added for touch devices in cases where the user does not have a keyboard.

I look forward to hearing your feedback!

PS: I have added an easter egg in the game. If you can type the end of this common local saying "Eindhoven de ...", you will unlock a special ability!
