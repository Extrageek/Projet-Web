import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'game-initiation-selector',
    templateUrl: '../../app/views/game-initiation.html',

})

export class GameInitiationComponent implements OnInit {
    constructor(private router: Router) {}

    goTo(username: string, numberOfPlayers: number) {
        console.log(username);
        console.log(numberOfPlayers);
        this.router.navigate(['/game-room']).then(
            (success) => {
                console.log("Valid username", success);
                return false;
            },
            (failure) => {
                console.log("Invalid username", failure);
            }
        );
    }
    ngOnInit() {//TODO
    }
}
