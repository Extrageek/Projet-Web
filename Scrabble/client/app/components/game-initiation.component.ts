import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IRoomMessage } from "../commons/messages/room-message.interface";
import { Player } from "../models/player";

@Component({
    moduleId: module.id,
    selector: "game-initiation-selector",
    templateUrl: "../../assets/templates/game-initiation.html",
    styleUrls: ["./../../assets/stylesheets/game-initiation.css"]
})

export class GameInitiationComponent implements OnInit, OnDestroy {
    private _onConnectedSubscription: Subscription;
    private _onJoinedRoomSubscription: Subscription;
    private _onUsernameAlreadyExistSubscription: Subscription;
    private _onInvalidRequestEventSubscription: Subscription;
    private _onConnectionErrorSubscription: Subscription;

    constructor(private router: Router, private socketService: SocketService) {
        // Default constructor
    }

    ngOnInit() {
        // Subscribe to event by calling the related method and save them for unsubscription OnDestroy
        this._onConnectedSubscription = this.onConnected();
        this._onJoinedRoomSubscription = this.onJoinedRoom();
        this._onUsernameAlreadyExistSubscription = this.onUsernameAlreadyExists();
        this._onInvalidRequestEventSubscription = this.onInvalidRequest();
        this._onConnectionErrorSubscription = this.onConnectionError();
        if (this.socketService._socket !== null && this.socketService._socket.disconnected) {
            this.socketService._socket.connect();
        }
    }

    ngOnDestroy() {
        // this.unsubscribeToChannelEvent();
    }

    // A callback function when the client is connected to the server.
    private onConnected(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.CONNECT)
            .subscribe(() => {
                console.log("I'm connected to the server");
            });
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.JOIN_ROOM)
            .subscribe((roomMessage: IRoomMessage) => {
                console.log("Joined the room", roomMessage);
                this.socketService.missingPlayers = roomMessage._numberOfMissingPlayers;
                if (roomMessage._roomIsReady) {
                    this.router.navigate(["/game-room"]);
                } else {
                    this.router.navigate(["/waiting-room"]);
                }
            });
    }

    // A callback function when in case of invalid request.
    private onInvalidRequest(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.INVALID_REQUEST)
            .subscribe(() => {
                console.log("The request sent to the server is invalid");
            });
    }

    // A callback function when the username is taken.
    private onUsernameAlreadyExists(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.USERNAME_ALREADY_EXIST)
            .subscribe(() => {
                //TODO: activate div like bootstrap alert-success
                alert("This username is already taken, please choose another username.");
                this.socketService.player.username = "";
            });
    }

    // A callback function when the server is not reachable.
    private onConnectionError(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.CONNECT_ERROR)
            .subscribe((error) => {
                console.log("Connection Error: The server is not reachable", error);
            });
    }

    // A callback function when the user ask for a new game.
    public sendNewGameRequest(username: string, numberOfPlayersStr: string) {
        console.log("new game request");
        if (username === null || numberOfPlayersStr === null) {
            throw new Error("Null argument error: All the parameters are required");
        }
        let numberOfPlayers = Number(numberOfPlayersStr);
        if (this.socketService.player.username === "") {
            this.socketService.player.username = username;
        } else {
            username = this.socketService.player.username;
        }
        console.log(this.socketService.player.username);
        this.socketService.player.numberOfPlayers = numberOfPlayers;
        this.socketService.emitMessage(
            SocketEventType.NEW_GAME_REQUEST,
            { 'username': username, 'gameType': numberOfPlayers });
    }

    private unsubscribeToChannelEvent() {
        this._onConnectedSubscription.unsubscribe();
        this._onJoinedRoomSubscription.unsubscribe();
        this._onUsernameAlreadyExistSubscription.unsubscribe();
        this._onInvalidRequestEventSubscription.unsubscribe();
        this._onConnectionErrorSubscription.unsubscribe();
    }
}
