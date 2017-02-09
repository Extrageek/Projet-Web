import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { SocketService } from "../services/socket-service";
import { SocketEventType } from '../commons/socket-eventType';

@Component({
    moduleId: module.id,
    providers: [SocketService],
    selector: "game-initiation-selector",
    templateUrl: "../../app/views/game-initiation.html",
})

export class GameInitiationComponent implements OnInit {

    private username = "";

    constructor(private router: Router, private socketService: SocketService) { }

    ngOnInit(): void {
        this.socketService.removeAllListeners();
        this.socketService.suscribeToEvent(SocketEventType.connectError, this.onConnectionError);
        this.socketService.suscribeToEvent(SocketEventType.connected, this.onConnected);
        this.socketService.suscribeToEvent(SocketEventType.joinRoom, this.onJoinedRoom);
        this.socketService.suscribeToEvent(SocketEventType.roomReady, this.onRoomReady);

        // TODO: Check how to make validation of the username instead of sending it to the server.
        this.socketService.suscribeToEvent(SocketEventType.invalidUsername, this.onInvalidUsername);
        this.socketService.suscribeToEvent(SocketEventType.usernameAlreadyExist, this.onUsernameAlreadyExists);
    }

    // A callback function when the username is not valid.
    public onInvalidUsername() {
        console.log("The username is invalid. The name can only contain alphanumeric characters.");
    }

    // A callback function when in case of invalid request.
    public onInvalidRequest() {
        console.log("The request sent to the server is invalid");
    }

    // A callback function when the username is taken.
    public onUsernameAlreadyExists() {
        console.log("This username is already taken, please choose another username.");
    }

    // A callback function when the client is connected to the server.
    public onConnected() {
        console.log("I'm connected to the server");
    }

    // A callback function when the server is not reachable.
    public onConnectionError() {
        console.log("Connection Error: The server is not reachable");
    }

    // A callback when the player join a room
    public onJoinedRoom(roomMessage: {
        username: string,
        roomNumber: number,
        numberOfMissingPlayers: number,
        roomIsReady: boolean,
        message: string
    }): void {

        console.log("test: from the server:", roomMessage);

        console.log(roomMessage.message, roomMessage.roomNumber,
            " RoomReadyState", roomMessage.roomIsReady,
            " missing players", roomMessage.numberOfMissingPlayers);
    }

    // A callback function when the room of the user is full and the game is ready to be started
    public onRoomReady(
        roomMessage: {
            username: string,
            roomNumber: number,
            numberOfMissingPlayers: number,
            roomIsReady: boolean,
            message: string
        }): void {


        console.log(roomMessage.message, roomMessage.roomNumber,
            " RoomReadyState", roomMessage.roomIsReady,
            " missing players", roomMessage.numberOfMissingPlayers);

        //this.router.navigate(["/game-room", { id: roomMessage.username }]);
        //console.log("router must be called",this.router);
    }

    // A callback function when the user ask for a new game.
    public sendNewGameRequest(username: string, numberOfPlayers: string) {
        this.socketService.addNewPlayer(username, numberOfPlayers);
    }


}
