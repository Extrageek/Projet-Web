import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SocketService } from "../services/socketService";

@Component({
    moduleId: module.id,
    providers: [SocketService],
    selector: "game-initiation-selector",
    templateUrl: "../../app/views/game-initiation.html",
})

export class GameInitiationComponent {
    constructor( private router: Router, private socketService: SocketService) {}

    navigateToGameRoom(username: string, numberOfPlayers: string) {
        this.socketService.sendNewDemandRequest(username, numberOfPlayers,
            [this.invalidPlayerName, this.invalidDemand,
                this.playerNameAlreadyExists, this.validRequest(username)]);
    }

    public invalidPlayerName() {
        alert("The username is invalid. The name can only contain alphanumeric characters.");
    }

    public invalidDemand() {
        alert("The request sent to the server is invalid");
    }

    public playerNameAlreadyExists() {
        alert("This username is already taken, please choose another username.");
    }

    public validRequest(username: string) {
        return (numberOfPlayersMissing: number) => {
            alert("Valid username! Please wait for " + String(numberOfPlayersMissing)
                + " players(s) before starting the game.");
            this.router.navigate(["/game-room", {id : username}]);
        };
    }
}
