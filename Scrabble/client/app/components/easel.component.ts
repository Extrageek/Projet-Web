import { Component } from '@angular/core';
import { ScrabbleLetter }	from '../models/scrabble-letter';

@Component({
  selector: "easel-selector",
  templateUrl: '../../app/views/easel.html',
    styleUrls: ['../../app/assets/easel.css'],
})
export class EaselComponent {
  letters : ScrabbleLetter[];

  constructor() {
      this.letters = Array(7).fill(0);
      this.letters = this.letters.map(() => new ScrabbleLetter());
  }
}



