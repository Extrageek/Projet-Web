import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { AppComponent } from './app.component';
import { ScrabbleBoardComponent } from './scrabbleBoard.component'
import { EaselComponent} from './easel.component';
import { ChatroomComponent } from './chatroom.component'

@NgModule({
  imports: [ BrowserModule ,
      FormsModule],
  declarations: [ AppComponent,
      EaselComponent,
      ScrabbleBoardComponent,
      ChatroomComponent],

  bootstrap: [ AppComponent ]
})
export class AppModule { }