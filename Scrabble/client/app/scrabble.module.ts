import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScrabbleBoard } from './scrabbleBoard.component';


@NgModule({
    imports: [ BrowserModule ],
    declarations: [ ScrabbleBoard ],
    bootstrap: [ ScrabbleBoard ]
})

export class ScrabbleModule { }