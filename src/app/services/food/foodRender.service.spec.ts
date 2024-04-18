import { TestBed } from '@angular/core/testing';
import { FoodRenderService } from './foodRender.service';
import { Food, FoodType } from './food.service';
import * as d3 from 'd3';

describe('FoodRenderService', () => {
  let service: FoodRenderService;
  let food: Food;
  let svgImage: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodRenderService);

    // Create a mock SVG in the DOM for d3 to manipulate
    const svg = d3.select(document.body).append('svg').attr('id', 'game-board');

    (food = {
      position: { x: 0, y: 0 },
      type: FoodType.Cherry,
      points: 100,
      effect: { grow: true },
    }),
      (svgImage = 'path/to/image.svg');
  });

  afterEach(() => {
    // Clean up the mock SVG from the DOM
    d3.select('#game-board').remove();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should render food correctly', () => {
    service.renderFood(food, svgImage);

    const image = d3.select('#game-board image');
    expect(image.attr('x')).toEqual('40');
    expect(image.attr('y')).toEqual('60');
    expect(image.attr('href')).toEqual(svgImage);
    expect(image.attr('width')).toEqual('20');
    expect(image.attr('height')).toEqual('20');
  });
});
