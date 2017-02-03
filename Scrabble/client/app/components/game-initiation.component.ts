import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SocketService } from "../services/socketService";
import { UserSettingsService } from "../services/userSettingService";
import { GameInitSocketHandler } from "../services/gameInitSocketHandler";

@Component({
    moduleId: module.id,
    providers: [SocketService],
    selector: "game-initiation-selector",
    templateUrl: "../../app/views/game-initiation.html",
})

export class GameInitiationComponent {
    constructor(private router: Router, private socketService: SocketService,
                private userSettings : UserSettingsService ) {}

    navigateToGameRoom(username: string, numberOfPlayers: string) {
        this.socketService.sendNewDemandRequest(username, numberOfPlayers,
            [GameInitSocketHandler.invalidPlayerName, GameInitSocketHandler.invalidDemand,
                GameInitSocketHandler.playerNameAlreadyExists, this.validRequest(username)]);
    }
    validRequest(username: string) {
        let router = this.router;
        return (numberOfPlayersMissing: number) => {
            this.userSettings.userName = username;
            alert("Valid username! Please wait for " + String(numberOfPlayersMissing)
                + " players(s) before starting the game.");
            router.navigate(["/game-room", {id : username}]);
        };
    }
}
