import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { SocketService } from "../services/socket-service";
import { SocketEventType } from '../commons/socket-eventType';
import { IRoomMessage } from '../models/room/room-message';

@Component({
    moduleId: module.id,
    selector: "game-initiation-selector",
    templateUrl: "../../assets/templates/game-initiation.html"
})

export class GameInitiationComponent implements OnInit, OnDestroy {

    private _username = "";
    connection: any; // TODO: Remove or handle this ...

    constructor(private router: Router, private socketService: SocketService) {
        // Default constructor
    }

    ngOnInit() {

        // TODO: unsubscribe all the event in the ngOnDestroy
        this.connection = this.socketService.subscribeToChannelEvent(SocketEventType.connectError)
            .subscribe(this.onConnectionError);

        this.socketService.subscribeToChannelEvent(SocketEventType.joinRoom)
            .subscribe(this.onJoinedRoom);

        this.socketService.subscribeToChannelEvent(SocketEventType.roomReady)
            .subscribe(this.onRoomReady);

        this.socketService.subscribeToChannelEvent(SocketEventType.usernameAlreadyExist)
            .subscribe(this.onUsernameAlreadyExists);
    }

    ngOnDestroy() {
        // TODO: unsubscribe all the event in the ngOnDestroy
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
    public onJoinedRoom(roomMessage: IRoomMessage): void {

        // For debug
        console.log(roomMessage);
    }

    // A callback function when the room of the user is full and the game is ready to be started
    private onRoomReady(roomMessage: IRoomMessage): void {

        // For debug
        console.log(roomMessage);
    }

    // A callback function when the user ask for a new game.
    public sendNewGameRequest(username: string, numberOfPlayers: string) {
        this._username = username;
        this.socketService.emitMessage(
            SocketEventType.newGameRequest,
            { 'username': username, 'gameType': Number(numberOfPlayers) });

        this.router.navigate(["/game-room", this._username]);
    }
}
