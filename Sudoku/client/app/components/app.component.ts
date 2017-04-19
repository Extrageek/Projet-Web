import { Component } from "@angular/core";

@Component({
    selector: "sudoku-app",
    template: `
        <div>
            <img src="../assets/images/sudoku-logo.png" alt="logo" />
        </div>
        <main>
            <router-outlet></router-outlet>
        </main>
    `,
})
export class AppComponent {
    name = "SUDOKU";
}
