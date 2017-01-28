import { Component, OnInit } from '@angular/core';
import { ScrabbleLetter }	from '../models/scrabble-letter';

@Component({
  selector: "easel-selector",
  template: `
    <div id="easelContainer">
      <ng-container *ngFor="let letter of letters; let i=index" >
          <input type = "image" src = "app/scrabbleImages/{{letter._imageSource}}" id = "{{i + 1}}"> 
      </ng-container>    
    </div>
  `,
    styleUrls: ['../app/assets/easel.css'],

})
export class EaselComponent implements OnInit {
  letters : ScrabbleLetter[];
  constructor() {
      this.letters = Array(7).fill(new ScrabbleLetter("A", "A.jpg"));
  }
   ngOnInit() {
     //TODO
    }
}


