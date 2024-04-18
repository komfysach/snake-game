import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FoodService } from './services/food/food.service';
import { SnakeService } from './services/snake/snake.service';
import { GameBoardComponent } from './components/game-board/game-board.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let snakeService: SnakeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, GameBoardComponent],
      providers: [FoodService, SnakeService],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    snakeService = TestBed.inject(SnakeService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'snake-game' title`, () => {
    expect(component.title).toEqual('snake-game');
  });

  it('should change direction', () => {
    const direction = { x: 1, y: 0 };
    component.changeDirection(direction);
    expect(snakeService.snake.direction).toEqual(direction);
  });

  it('should toggle pause', () => {
    const initialPauseState = snakeService.paused;
    component.togglePause();
    expect(snakeService.paused).toBe(!initialPauseState);
  });
});
