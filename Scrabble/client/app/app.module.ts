import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ScrabbleBoardComponent } from './scrabble-board.component';
import { EaselComponent } from './easel.component';
import { ChatroomComponent } from './chatroom.component';
import { InformationPanelComponent } from './information-panel.component';

@NgModule({
  imports: [ BrowserModule ,
      FormsModule],
  declarations: [ AppComponent,
      EaselComponent,
      ScrabbleBoardComponent,
      ChatroomComponent,
      InformationPanelComponent],

  bootstrap: [ AppComponent ]
})
export class AppModule { }
