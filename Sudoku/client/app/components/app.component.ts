import { Component } from '@angular/core';

@Component({
    selector: 'sudoku-app',
    template: `<h1> {{name}}</h1>
        <main (window:onbeforeunload)="saveAndLogout($event)">
            <router-outlet></router-outlet>
        </main>
    `,
})
export class AppComponent {
    name = 'SUDOCUL';
}
