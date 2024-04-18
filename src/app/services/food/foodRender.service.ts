import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Food } from './food.service';

@Injectable({
  providedIn: 'root',
})
export class FoodRenderService {
  renderFood(food: Food, svgImage: string) {
    const cellSize = 20;
    const svg = d3.select('#game-board');

    food.foodElement = svg
      .append('image')
      .attr('x', food.position.x * cellSize)
      .attr('y', food.position.y * cellSize)
      .attr('href', svgImage)
      .attr('width', cellSize)
      .attr('height', cellSize);
  }
}
