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
    constructor(private router: Router, private socketService: SocketService) {}

    navigateToGameRoom(username: string, numberOfPlayers: string) {
        //TODO : Send username & numberOfPlayers to server for validation
        console.log("here");
        this.socketService.sendNewDemandRequest(username, numberOfPlayers,
            [this.invalidPlayerName, this.invalidDemand, this.playerNameAlreadyExists, this.validRequest()]);
        console.log("Username received:", username);
        console.log("Number of players:", numberOfPlayers);
    }

    private invalidPlayerName() {
        alert("Le nom donné n'est pas valide. Le nom ne peut contenir que des caractères alphanumériques.");
    }

    private invalidDemand() {
        alert("La demande envoyée au serveur est invalide.");
    }

    private playerNameAlreadyExists() {
        alert("Le nom du joueur a déjà été pris.");
    }

    private validRequest() {
        let router = this.router;
        return (numberOfPlayersMissing: number) => {
            alert("Demande réussie. Il manque encore " + String(numberOfPlayersMissing)
                + " joueur(s) pour commencer la partie.");
            router.navigate(["/game-room"]);
        };
    }
}
