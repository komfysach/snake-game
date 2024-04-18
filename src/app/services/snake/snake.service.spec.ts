import { TestBed } from '@angular/core/testing';
import { SnakeService } from './snake.service';
import { Food, FoodService, FoodType } from '../food/food.service';

describe('SnakeService', () => {
  let service: SnakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle pause', () => {
    service.togglePause();
    expect(service.paused).toBeTrue();
  });

  it('should update position', () => {
    const initialPosition = { ...service.snake.body[0] };
    service.updatePosition();
    expect(service.snake.body[0]).not.toEqual(initialPosition);
  });

  it('should grow', () => {
    const initialLength = service.snake.body.length;
    service.grow();
    expect(service.snake.body.length).toBe(initialLength + 1);
  });

  it('should eat food', () => {
    const foodPosition = { ...service.snake.body[0] };
    const food: Food = {
      position: { x: 0, y: 0 },
      type: FoodType.Pizza,
      points: 400,
      effect: { grow: true, speedUp: true },
    };
    expect(service.eatFood(foodPosition, food)).toBeTrue();
  });

  it('should apply food effect', () => {
    const food: Food = {
      position: { x: 0, y: 0 },
      type: FoodType.Pizza,
      points: 400,
      effect: { grow: true, speedUp: true },
    };
    const initialSpeed = service.snake.speed;
    service.applyFoodEffect(food);
    expect(service.snake.speed).toBe(initialSpeed + 0.1);
  });

  it('should check if snake is at position', () => {
    const position = { ...service.snake.body[0] };
    expect(service.isAtPosition(position)).toBeTrue();
  });

  it('should check if snake collides with wall', () => {
    service.snake.body[0] = { x: -1, y: 0 };
    expect(service.collidesWithWall(20)).toBeTrue();
  });

  it('should check if snake collides with self', () => {
    service.grow();
    service.snake.body[1] = { ...service.snake.body[0] };
    expect(service.collidesWithSelf()).toBeTrue();
  });

  it('should enable easter egg', () => {
    service.enableEasterEgg();
    expect(service.snake.wallPassing).toBeTrue();
  });

  it('should wrap position', () => {
    const position = { x: -1, y: -1 };
    const wrappedPosition = service.wrapPosition(position);
    expect(wrappedPosition.x).toBe(service.boardWidth! - 1);
    expect(wrappedPosition.y).toBe(service.boardHeight! - 1);
  });

  it('should move', () => {
    const initialPosition = { ...service.snake.body[0] };
    service.move();
    expect(service.snake.body[0]).not.toEqual(initialPosition);
  });

  it('should apply food effect with switch controls', () => {
    const food: Food = {
      position: { x: 0, y: 0 },
      type: FoodType.Pizza,
      points: 400,
      effect: { grow: true, speedUp: true, switchControls: true },
    };
    service.applyFoodEffect(food);
    expect(service.switchControls).toBeTrue();
  });
});
