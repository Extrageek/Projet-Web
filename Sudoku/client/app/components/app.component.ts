import { Component } from '@angular/core';

@Component({
    selector: 'sudoku-app',
    template: `<h1>{{name}}</h1>
        <main>
            <router-outlet></router-outlet>
        </main>
    `,
})
export class AppComponent {
    name = 'SUDOKU';
}
