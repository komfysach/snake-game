import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { FoodRenderService } from './foodRender.service';

export enum FoodType {
  Cherry = 'cherry',
  Mushroom = 'mushroom',
  Pizza = 'pizza',
}

export interface Position {
  x: number;
  y: number;
}

export interface FoodEffect {
  grow: boolean;
  switchControls?: boolean;
  speedUp?: boolean;
}
export interface Food {
  position: Position;
  type: FoodType;
  points: number;
  highScore?: number;
  effect: FoodEffect;
  foodElement?: d3.Selection<SVGImageElement, unknown, HTMLElement, unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private foodRenderService: FoodRenderService) {}

  foods: Food[] = [];
  totalPoints: number = 0;

  private foodProperties = new Map<
    FoodType,
    { points: number; effect: FoodEffect; svgImage: string }
  >([
    [
      FoodType.Cherry,
      { points: 100, effect: { grow: true }, svgImage: 'assets/cherry.svg' },
    ],
    [
      FoodType.Mushroom,
      {
        points: 350,
        effect: { grow: true, switchControls: true },
        svgImage: 'assets/mushroom.svg',
      },
    ],
    [
      FoodType.Pizza,
      {
        points: 400,
        effect: { grow: true, speedUp: true },
        svgImage: 'assets/pizza.svg',
      },
    ],
  ]);

  generateNewFoodPosition(gridSize: number) {
    let x: number;
    let y: number;

    do {
      x = Math.floor(Math.random() * gridSize);
      y = Math.floor(Math.random() * gridSize);
    } while (this.isPositionOccupied({ x, y }));

    const type = this.getRandomFoodType();
    const { points, effect, svgImage } = this.foodProperties.get(type)!;

    const food = { position: { x, y }, type, points, effect };

    this.foods.push(food);
    this.foodRenderService.renderFood(food, svgImage);
  }

  removeFood(food: Food) {
    food.foodElement?.remove();
    const index = this.foods.indexOf(food);
    if (index > -1) {
      this.foods.splice(index, 1);
    }
  }

  isPositionOccupied(position: { x: number; y: number }): boolean {
    return this.foods.some(
      (food) => food.position.x === position.x && food.position.y === position.y
    );
  }

  private getRandomFoodType(): FoodType {
    const foodTypes = Array.from(this.foodProperties.keys());
    const randomIndex = Math.floor(Math.random() * foodTypes.length);

    return foodTypes[randomIndex];
  }

  getSvgImageForFoodType(type: FoodType) {
    return this.foodProperties.get(type)?.svgImage || '';
  }

  addPoints(points: number) {
    this.totalPoints += points;
  }

  getHighScore(): number {
    const highScore = localStorage.getItem('highScore');
    return highScore ? parseInt(highScore) : 0;
  }

  setHighScore(score: number) {
    const currentHighScore = this.getHighScore();
    if (score > currentHighScore) {
      localStorage.setItem('highScore', score.toString());
    }
  }
}
