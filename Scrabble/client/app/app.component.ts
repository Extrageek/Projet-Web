import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <grid>Loading Scrabble board 1 here...</grid>
    <scrabble-main-board>Loading Scrabble board 2 here...</scrabble-main-board>
    <easel>Loading easel...</easel>
  `,
})
export class AppComponent { name = 'Angular'; }
