import {Component, OnInit} from '@angular/core';
import {ScrabbleLetter }	from './scrabbleLetter';

@Component({
	selector: "easel",
	template: `
    <div style ="width:420px; height:58px;">
      <ng-container *ngFor="let letter of letters; let i=index" >
          <input type = "image" src = "./app/{{letter._imageSource}}" id = "{{i + 1}}"> 
          <!--(dragstart)="draggingStart($event,letter)">-->
          
      </ng-container>    
 
      <!--<input #myInput type="text" />-->
    </div>
  `,
    styles : [`
        input {
            width:58px; 
            height:58px;
            border:1px solid #000;
            float:left;
        }
    `]
})
export class EaselComponent implements OnInit {
  letters:ScrabbleLetter[];
  constructor() {
      this.letters = Array(7).fill(new ScrabbleLetter("A", "A.jpg"));
  }
  // draggingStart(event:DragEvent, letter:ScrabbleLetter) {
  //     console.log(letter.letter);
  // }
	ngOnInit() { }
}


