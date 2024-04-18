import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardComponent } from './game-board.component';
import { SnakeService } from '../../services/snake/snake.service';
import { FoodService, FoodType } from '../../services/food/food.service';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let snakeService: SnakeService;
  let foodService: FoodService;

  beforeEach(() => {
    snakeService = jasmine.createSpyObj('SnakeService', [
      'isAtPosition',
      'applyFoodEffect',
      'move',
      'collidesWithWall',
      'collidesWithSelf',
    ]);

    snakeService.snake = {
      body: [{ x: 10, y: 10 }],
      direction: { x: 1, y: 0 },
      speed: 1,
      bodyElements: [],
    };

    foodService = jasmine.createSpyObj('FoodService', [
      'generateNewFoodPosition',
      'removeFood',
      'addPoints',
      'getHighScore',
      'setHighScore',
    ]);

    TestBed.configureTestingModule({
      declarations: [GameBoardComponent],
      providers: [
        { provide: SnakeService, useValue: snakeService },
        { provide: FoodService, useValue: foodService },
      ],
    });

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
  });

  it('should create the game board', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the game', () => {
    component.resetGame();
    expect(snakeService.snake.body).toEqual([{ x: 10, y: 10 }]);
    expect(snakeService.snake.direction).toEqual({ x: 1, y: 0 });
    expect(snakeService.snake.speed).toBe(1.5);
    expect(foodService.totalPoints).toBe(0);
  });

  it('should detect if cell is part of the snake', () => {
    snakeService.snake.body = [{ x: 0, y: 0 }];
    expect(component.isSnake(0, 0)).toBeTrue();
  });

  it('should detect if cell is food', () => {
    foodService.foods = [
      {
        position: { x: 0, y: 0 },
        type: FoodType.Cherry,
        points: 100,
        effect: { grow: true },
      },
    ];
    expect(component.isFood(0, 0)).toBeTrue();
  });
});
