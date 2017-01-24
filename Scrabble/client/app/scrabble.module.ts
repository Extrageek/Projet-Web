import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { EaselComponent } from './easel.component';
import { GridComponent } from './grid.component'
import { ScrabbleBoard } from './scrabbleBoard.component';
import { AppComponent } from './app.component';

@NgModule({
    imports: [ BrowserModule, FormsModule],
    declarations: [AppComponent, EaselComponent, GridComponent, ScrabbleBoard],
    bootstrap: [ AppComponent ]
})

export class ScrabbleModule { }