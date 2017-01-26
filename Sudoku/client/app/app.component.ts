import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<h1> {{name}}</h1>
    <sudoku-grid></sudoku-grid>
  `,
})
export class AppComponent {
  name = 'Sudoku Game ...';
}
