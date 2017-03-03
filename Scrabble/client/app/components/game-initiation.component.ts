import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';

import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IRoomMessage } from "../commons/messages/room-message";

@Component({
    moduleId: module.id,
    selector: "game-initiation-selector",
    templateUrl: "../../assets/templates/game-initiation.html"
})

export class GameInitiationComponent implements OnInit, OnDestroy {

    private _username = "";
    private _onConnectedSubscription: Subscription;
    private _onJoinedRoomSubscription: Subscription;
    private _onLeaveRoomSubscription: Subscription;
    private _onReceivedMessageSubscription: Subscription;
    private _onUsernameAlreadyExistSubscription: Subscription;
    private _onInvalidRequestEventSubscription: Subscription;
    private _onConnectionErrorSubscription: Subscription;

    constructor(private router: Router, private socketService: SocketService) {
        // Default constructor
    }

    ngOnInit() {
        // Subscribe to event by calling the related method and save them for unsubsciption OnDestroy
        this._onConnectedSubscription = this.onConnected();
        this._onJoinedRoomSubscription = this.onJoinedRoom();
        this._onLeaveRoomSubscription = this.onleaveRoom();
        this._onUsernameAlreadyExistSubscription = this.onUsernameAlreadyExists();
        this._onInvalidRequestEventSubscription = this.onInvalidRequest();
        this._onConnectionErrorSubscription = this.onConnectionError();
    }

    ngOnDestroy() {
        // unsubscribe to all the listening events
    }

    // A callback function when the client is connected to the server.
    private onConnected(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.connect)
            .subscribe(() => {
                console.log("I'm connected to the server");
            });
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.joinRoom)
            .subscribe((roomMessage: IRoomMessage) => {
                console.log("Joined the room", roomMessage);
                if (roomMessage._roomIsReady) {
                    this.router.navigate(["/game-room", this._username]);
                } else {
                    alert("waiting for a missing member before starting the game");
                }
            });
    }

    // A callback when the player join a room
    private onleaveRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.leaveRoom)
            .subscribe((roomMessage: IRoomMessage) => {
                console.log("Left the room", roomMessage);
            });
    }

    // A callback function when in case of invalid request.
    private onInvalidRequest(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.invalidRequest)
            .subscribe(() => {
                console.log("The request sent to the server is invalid");
            });
    }

    // A callback function when the username is taken.
    private onUsernameAlreadyExists(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.usernameAlreadyExist)
            .subscribe(() => {
                alert("This username is already taken, please choose another username.");
            });
    }

    // A callback function when the server is not reachable.
    private onConnectionError(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.connectError)
            .subscribe((error) => {
                console.log("Connection Error: The server is not reachable", error);
            });
    }

    // A callback function when the user ask for a new game.
    public sendNewGameRequest(username: string, numberOfPlayers: string) {
        if (username === null || numberOfPlayers === null) {
            throw new Error("Null argument error: All the parameters are required");
        }

        this._username = username;
        this.socketService.emitMessage(
            SocketEventType.newGameRequest,
            { 'username': username, 'gameType': Number(numberOfPlayers) });
    }

    public waitingForMissingMember(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.connectError)
            .subscribe((error) => {
                alert("Waiting for missing member: The server is not reachable");
            });
    }
}
