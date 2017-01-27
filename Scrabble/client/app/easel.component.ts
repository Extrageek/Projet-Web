import {Component, OnInit} from '@angular/core';
import {ScrabbleLetter }	from './scrabbleLetter';

@Component({
	selector: "easel",
	template: `
    <div id="easelContainer">
      <ng-container *ngFor="let letter of letters; let i=index" >
          <input type = "image" src = "./app/{{letter._imageSource}}" id = "{{i + 1}}"> 
      </ng-container>    
    </div>
  `,
    styleUrls:['./app/easel.css'],

})
export class EaselComponent implements OnInit {
  letters:ScrabbleLetter[];
  constructor() {
      this.letters = Array(7).fill(new ScrabbleLetter("A", "A.jpg"));
  }
	ngOnInit() { }
}


