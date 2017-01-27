import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <scrabble-main-board>Loading Scrabble board 2 here...</scrabble-main-board>
    <easel>Loading easel...</easel>
    <scrabble-chatroom>Loading chatroom...</scrabble-chatroom>
  `,
})
export class AppComponent { name = 'Angular'; }
