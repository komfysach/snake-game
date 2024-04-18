import { Component, OnDestroy, OnInit } from '@angular/core';
import { FoodService } from '../../services/food/food.service';
import { SnakeService } from '../../services/snake/snake.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit, OnDestroy {
  gridSize: number;
  cells: number[];
  intervalId?: number;
  gameOver: boolean = false;
  screenSizeUpdated: boolean = false;
  gameStarted: boolean = false;
  keyPresses: string[] = [];

  constructor(
    public snakeService: SnakeService,
    private foodService: FoodService
  ) {
    this.gridSize = this.calculateGridSize();
    this.onWindowResize = this.onWindowResize.bind(this);
    this.cells = Array.from({ length: this.gridSize ** 2 }, (_, i) => i);
  }

  ngOnInit(): void {
    this.initializeGame();
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('keypress', this.handleKeypress.bind(this));
  }

  handleKeypress(event: KeyboardEvent) {
    this.keyPresses.push(event.key);

    // Enter to reset the game
    if (event.key === 'Enter') {
      this.resetGame();
    }

    // Only keep the last 6 keys
    if (this.keyPresses.length > 6) {
      this.keyPresses.shift();
    }

    // Check if the last 6 keys match 'gekste'
    if (this.keyPresses.join('') === 'gekste') {
      this.snakeService.enableEasterEgg();

      // Clear the keyPresses array
      this.keyPresses = [];
    }
  }

  ngAfterViewInit(): void {
    this.startGame();
  }

  startGame(): void {
    // clear interval if it exists
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      const food = this.foodService.foods.find((food) =>
        this.snakeService.isAtPosition(food.position)
      );

      if (food) {
        this.snakeService.applyFoodEffect(food);
        this.foodService.removeFood(food);
        this.foodService.addPoints(food.points);
        this.foodService.generateNewFoodPosition(this.gridSize);
      }

      this.snakeService.move();

      if (
        (!this.snakeService.snake.wallPassing &&
          this.snakeService.collidesWithWall(this.gridSize)) ||
        this.snakeService.collidesWithSelf()
      ) {
        this.gameOver = true;
        window.clearInterval(this.intervalId);
      }
    }, 1000 / this.snakeService.snake.speed);
  }

  resetGame(): void {
    const highScore = this.foodService.getHighScore();
    if (this.foodService.totalPoints > highScore) {
      this.foodService.setHighScore(this.foodService.totalPoints);
    }
    this.snakeService.snake = {
      body: [{ x: 10, y: 10 }],
      direction: { x: 1, y: 0 },
      speed: 1.5,
      bodyElements: [],
    };
    this.foodService.totalPoints = 0;
    this.snakeService.switchControls = false;
    this.gameOver = false;
    this.initializeGame();
    this.startGame();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('keypress', this.handleKeypress.bind(this));
  }

  onWindowResize(): void {
    this.screenSizeUpdated = true;
    this.snakeService.togglePause();
  }

  getRow(i: number): number {
    return Math.floor(i / this.gridSize);
  }

  getColumn(i: number): number {
    return i % this.gridSize;
  }

  getFoodImage(x: number, y: number): string {
    const food = this.foodService.foods.find(
      (food) => food.position.x === x && food.position.y === y
    );
    return food ? this.foodService.getSvgImageForFoodType(food.type) : '';
  }

  isSnake(x: number, y: number): boolean {
    return this.snakeService.snake.body.some(
      (part) => part.x === x && part.y === y
    );
  }

  isSnakeHead(x: number, y: number): boolean {
    const head = this.snakeService.snake.body[0];
    return head.x === x && head.y === y;
  }

  isSnakeBody(x: number, y: number): boolean {
    return this.snakeService.snake.body.some(
      (part, i) =>
        i !== 0 &&
        i !== this.snakeService.snake.body.length - 1 &&
        part.x === x &&
        part.y === y
    );
  }

  isSnakeTail(x: number, y: number): boolean {
    const tail =
      this.snakeService.snake.body[this.snakeService.snake.body.length - 1];
    return tail.x === x && tail.y === y;
  }

  isFood(x: number, y: number): boolean {
    return this.foodService.foods.some(
      (food) => food.position.x === x && food.position.y === y
    );
  }

  private calculateGridSize(): number {
    return window.innerWidth < 768 ? 20 : 30;
  }

  private initializeGame(): void {
    this.cells = Array.from({ length: this.gridSize ** 2 }, (_, i) => i);
    for (let i = 0; i < 3; i++) {
      this.foodService.generateNewFoodPosition(this.gridSize);
    }
  }
}
