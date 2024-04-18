import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { FoodService } from './services/food/food.service';

@NgModule({
  declarations: [AppComponent, GameBoardComponent],
  imports: [BrowserModule],
  providers: [FoodService],
  bootstrap: [AppComponent],
})
export class AppModule {}
