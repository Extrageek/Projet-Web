import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { SocketService } from "../services/socket-service";
import { SocketEventType } from '../commons/socket-eventType';
import { IRoomMessage } from '../models/room/room-message';

@Component({
    moduleId: module.id,
    providers: [SocketService],
    selector: "game-room-selector",
    templateUrl: "../../assets/templates/game-room.html",
    styleUrls: ["../../assets/stylesheets/game-room.css"],
})

export class GameComponent implements OnInit, OnDestroy {
    connection: any; // TODO: Hell no!!! Remove this please

    constructor(private router: Router, private socketService: SocketService) {
        // Constructor
    }

    ngOnInit() {

        // TODO: unsubscribe all the event in the ngOnDestroy
        this.socketService.subscribeToChannelEvent(SocketEventType.connectError)
            .subscribe(this.onConnectionError);

        this.socketService.subscribeToChannelEvent(SocketEventType.joinRoom)
            .subscribe(this.onJoinedRoom);

        this.socketService.subscribeToChannelEvent(SocketEventType.roomReady)
            .subscribe(this.onRoomReady);

        this.socketService.subscribeToChannelEvent(SocketEventType.exchangedLetter)
            .subscribe(this.onChangedLettersReceived);
    }

    ngOnDestroy() {
        // TODO: unsubscribe all the event in the ngOnDestroy
    }

    // A callback function when the server is not reachable.
    public onConnectionError() {
        console.log("Connection Error: The server is not reachable");
    }

    // A callback when the player join a room
    public onJoinedRoom(roomMessage: IRoomMessage): void {

        // For debug
        console.log("In Room", roomMessage);
    }

    // A callback when the player leave a room
    public onLeaveRoom(roomMessage: IRoomMessage): void {

        // For debug
        console.log("In Room", roomMessage);
    }

    // A callback function when the room of the user is full and the game is ready to be started
    private onRoomReady(roomMessage: IRoomMessage): void {

        // For debug
        console.log("In Room", roomMessage);
    }

    public changeLettersRequest(/*lettersToBeChanged: Array<string>*/) {

        // TODO: Should be removed after a clean debug
        let fakeLetters = ['A', 'E', 'M', 'N', 'U'];
        console.log("Letter to change:", fakeLetters);
        this.socketService.emitMessage(SocketEventType.exchangeLettersRequest, fakeLetters);
    }

    private onChangedLettersReceived(changedLetters: Object) {
        console.log("In Room", "Hey! I received new letters from the server: ", changedLetters);
    }

    // A callback function when in case of invalid request.
    private onInvalidRequest() {
        console.log("In Room", "The request sent to the server is invalid");
    }
}
