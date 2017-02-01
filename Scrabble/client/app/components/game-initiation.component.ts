import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'game-initiation-selector',
    templateUrl: '../../app/views/game-initiation.html',
})

export class GameInitiationComponent {
    constructor(private router: Router) {}

    navigateToGameRoom(username: string, numberOfPlayers: number) {
        //TODO : Send username & numberOfPlayers to server for validation
        console.log("Username received:", username);
        console.log("Number of players:", numberOfPlayers);
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
}
