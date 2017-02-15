import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { SocketService } from "../services/socket-service";
import { SocketEventType } from '../commons/socket-eventType';

@Component({
    moduleId: module.id,
    providers: [SocketService],
    selector: "game-room-selector",
    templateUrl: "../../assets/templates/game-room.html",
})

export class GameComponent implements OnInit {
    constructor(private router: Router, private socketService: SocketService) {
        // Constructor
    }

    ngOnInit() {

        SocketService.getInstance().removeAllListeners();
        SocketService.getInstance().suscribeToEvent(SocketEventType.connectError, this.onConnectionError);
        SocketService.getInstance().suscribeToEvent(SocketEventType.joinRoom, this.onJoinedRoom);
        SocketService.getInstance().suscribeToEvent(SocketEventType.leaveRoom, this.onLeaveRoom);
        SocketService.getInstance().suscribeToEvent(SocketEventType.roomReady, this.onRoomReady);

        // TODO: Should be removed after a clean debug
        let fakeLetters = ['A', 'K', 'E', 'O', 'P'];

        SocketService.getInstance().changeLettersRequest(fakeLetters);
    }

    // A callback function when the server is not reachable.
    public onConnectionError() {
        console.log("Connection Error: The server is not reachable");
    }

    // A callback when the player join a room
    public onJoinedRoom(roomMessage: {
        username: string,
        roomId: string,
        numberOfMissingPlayers: number,
        roomIsReady: boolean,
        message: string
    }): void {

        // For debug
        console.log(roomMessage);
        console.log(roomMessage.message, roomMessage.roomId,
            " RoomReadyState", roomMessage.roomIsReady,
            " missing players", roomMessage.numberOfMissingPlayers);
    }

    // A callback when the player leave a room
    public onLeaveRoom(roomMessage: {
        username: string,
        roomId: string,
        numberOfMissingPlayers: number,
        roomIsReady: boolean,
        message: string
    }): void {

        // For debug
        console.log("On leaving room", roomMessage);
        console.log(roomMessage.message, roomMessage.roomId,
            " RoomReadyState", roomMessage.roomIsReady,
            " missing players", roomMessage.numberOfMissingPlayers);
    }

    // A callback function when the room of the user is full and the game is ready to be started
    private onRoomReady(roomMessage: {
        username: string,
        roomId: string,
        numberOfMissingPlayers: number,
        roomIsReady: boolean,
        message: string
    }): void {

        // For debug
        console.log(roomMessage);
        // console.log(roomMessage.message, roomMessage.roomId,
        //     " RoomReadyState", roomMessage.roomIsReady,
        //     " missing players", roomMessage.numberOfMissingPlayers);

        //this.router.navigate(["/game-room", { id: roomMessage.username }]);
        //console.log("router must be called",this.router);
    }

    private changeLettersRequest(lettersToBeChanged: Array<string>) {

        // TODO: Should be removed after a clean debug
        let fakeLetters = ['A', 'K', 'E', 'O', 'P'];

        SocketService.getInstance().changeLettersRequest(fakeLetters);
    }

    // A callback function when in case of invalid request.
    private onInvalidRequest() {
        console.log("The request sent to the server is invalid");
    }
}
