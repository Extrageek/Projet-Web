import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './components/app.component';
import { ScrabbleBoardComponent } from './components/scrabble-board.component';
import { EaselComponent } from './components/easel.component';
import { ChatroomComponent } from './components/chatroom.component';
import { InformationPanelComponent } from './components/information-panel.component';
import { GameInitiationComponent } from './components/game-initiation.component';

@NgModule({
  imports: [ BrowserModule ,
      FormsModule],
  declarations: [ AppComponent,
      EaselComponent,
      ScrabbleBoardComponent,
      ChatroomComponent,
      InformationPanelComponent,
      GameInitiationComponent],

  bootstrap: [ AppComponent ]
})
export class AppModule { }
