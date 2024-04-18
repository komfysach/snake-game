import { TestBed } from '@angular/core/testing';
import { FoodService, FoodType } from './food.service';

describe('FoodService', () => {
  let service: FoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate new food position', () => {
    service.generateNewFoodPosition(20);
    expect(service.foods.length).toBe(1);
  });

  it('should remove food', () => {
    service.generateNewFoodPosition(20);
    const food = service.foods[0];
    service.removeFood(food);
    expect(service.foods.length).toBe(0);
  });

  it('should check if position is occupied', () => {
    service.generateNewFoodPosition(20);
    const food = service.foods[0];
    expect(service.isPositionOccupied(food.position)).toBeTrue();
  });

  it('should get SVG image for food type', () => {
    const cherryImage = service.getSvgImageForFoodType(FoodType.Cherry);
    expect(cherryImage).toBe('assets/cherry.svg');
  });

  it('should add points', () => {
    service.addPoints(100);
    expect(service.totalPoints).toBe(100);
  });

  it('should get and set high score', () => {
    service.setHighScore(1000);
    expect(service.getHighScore()).toBe(1000);
  });
});
