import { Injectable } from '@angular/core';
import { Food } from '../food/food.service';
import * as d3 from 'd3';

export interface Snake {
  body: { x: number; y: number }[];
  direction: { x: number; y: number };
  speed: number;
  bodyElements: d3.Selection<SVGRectElement, unknown, HTMLElement, unknown>[];
  wallPassing?: boolean;
}

enum Keys {
  A = 'a',
  W = 'w',
  D = 'd',
  S = 's',
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
}

const FOOD_EFFECT_TIMEOUT = 30; // 30 seconds

@Injectable({
  providedIn: 'root',
})
export class SnakeService {
  snake: Snake;
  paused: boolean = false;
  switchControls: boolean = false;
  foodInBody: Food[] = [];
  boardWidth: number | undefined;
  boardHeight: number | undefined;
  switchControlsTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.snake = {
      body: [{ x: 10, y: 10 }],
      direction: { x: 1, y: 0 },
      speed: 1.5,
      bodyElements: [],
    };

    const keyMap: { [key in Keys]: () => { x: number; y: number } } = {
      [Keys.A]: () => (this.switchControls ? { x: 0, y: 1 } : { x: 0, y: -1 }),
      [Keys.W]: () => (this.switchControls ? { x: 1, y: 0 } : { x: -1, y: 0 }),
      [Keys.D]: () => (this.switchControls ? { x: 0, y: -1 } : { x: 0, y: 1 }),
      [Keys.S]: () => (this.switchControls ? { x: -1, y: 0 } : { x: 1, y: 0 }),
      [Keys.ArrowLeft]: () =>
        this.switchControls ? { x: 0, y: 1 } : { x: 0, y: -1 },
      [Keys.ArrowUp]: () =>
        this.switchControls ? { x: 1, y: 0 } : { x: -1, y: 0 },
      [Keys.ArrowRight]: () =>
        this.switchControls ? { x: 0, y: -1 } : { x: 0, y: 1 },
      [Keys.ArrowDown]: () =>
        this.switchControls ? { x: -1, y: 0 } : { x: 1, y: 0 },
    };

    window.addEventListener('keydown', (event) => {
      if (event.key in keyMap) {
        this.snake.direction = keyMap[event.key as keyof typeof keyMap]();
      } else if (event.key === ' ') {
        this.togglePause();
      }
    });

    if (window.innerWidth > 768) {
      this.boardWidth = 30;
      this.boardHeight = 30;
    } else {
      this.boardWidth = 20;
      this.boardHeight = 20;
    }
  }

  togglePause() {
    this.paused = !this.paused;
  }

  // Wrap the position to the other side of the board if it goes off the edge
  wrapPosition(position: { x: number; y: number }): { x: number; y: number } {
    console.log('boardWidth:', this.boardWidth);
    console.log('boardHeight:', this.boardHeight);

    return {
      x:
        (position.x < 0 ? position.x + this.boardWidth! : position.x) %
        this.boardWidth!,
      y:
        (position.y < 0 ? position.y + this.boardHeight! : position.y) %
        this.boardHeight!,
    };
  }

  updatePosition() {
    const head = this.snake.body[0];
    let newHead = {
      x: head.x + this.snake.direction.x,
      y: head.y + this.snake.direction.y,
    };

    console.log('New head position before wrapping:', newHead);

    this.snake.body.unshift(newHead);
    this.snake.body.pop();

    // If wall passing is enabled, wrap the new head position around to the other side of the board
    if (this.snake.wallPassing) {
      this.snake.body[0] = this.wrapPosition(this.snake.body[0]);
    }

    console.log('New head position after wrapping:', this.snake.body[0]);

    this.snake.bodyElements.forEach((part, index) => {
      const position = this.wrapPosition(this.snake.body[index]);
      part.attr('x', position.x).attr('y', position.y);
    });
  }

  grow() {
    const tail = { ...this.snake.body[this.snake.body.length - 1] };
    this.snake.body.push(tail);
    this.updatePosition();
  }

  eatFood(foodPosition: { x: number; y: number }, food: Food) {
    const head = this.snake.body[0];
    if (head.x === foodPosition.x && head.y === foodPosition.y) {
      this.foodInBody.unshift(food);
      return true;
    }
    return false;
  }

  applyFoodEffect(food: Food) {
    if (food.effect.grow) {
      this.grow();
    }
    if (food.effect.speedUp) {
      this.snake.speed += 0.1;
    }
    if (food.effect.switchControls) {
      this.switchControls = true;
      if (this.switchControlsTimeoutId) {
        clearTimeout(this.switchControlsTimeoutId);
      }
      this.switchControlsTimeoutId = setTimeout(() => {
        this.switchControls = false;
      }, FOOD_EFFECT_TIMEOUT * 1000); // switch back after 30 seconds
    }
  }

  isAtPosition(position: { x: number; y: number }): boolean {
    return this.snake.body.some(
      (part) => part.x === position.x && part.y === position.y
    );
  }

  collidesWithWall(gridSize: number): boolean {
    const head = this.snake.body[0];
    return head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
  }

  collidesWithSelf(): boolean {
    const head = this.snake.body[0];
    return this.snake.body.some(
      (part, i) => i !== 0 && part.x === head.x && part.y === head.y
    );
  }

  move() {
    if (!this.paused) {
      this.updatePosition();
    }
  }

  enableEasterEgg() {
    this.snake.wallPassing = true;
  }
}
