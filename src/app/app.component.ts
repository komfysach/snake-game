import { Component } from '@angular/core';
import { FoodService } from './services/food/food.service';
import { SnakeService } from './services/snake/snake.service';

type Direction = { x: number; y: number };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'snake-game';
  constructor(
    public foodService: FoodService,
    private snakeService: SnakeService
  ) {}

  // for mobile touch devices
  changeDirection(direction: Direction) {
    if (this.snakeService.switchControls) {
      this.snakeService.snake.direction = { x: -direction.x, y: -direction.y };
    } else {
      this.snakeService.snake.direction = direction;
    }
  }

  togglePause() {
    this.snakeService.togglePause();
  }
}
