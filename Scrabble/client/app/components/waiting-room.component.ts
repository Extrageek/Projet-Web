import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";

import { Router } from "@angular/router";

import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IRoomMessage } from "../commons/messages/room-message.interface";
import { Player } from "../models/player";

@Component({
    moduleId: module.id,
    selector: "waiting-room-selector",
    templateUrl: "../../assets/templates/waiting-room.html",
    styleUrls: ["./../../assets/stylesheets/waiting-room.css"]
})
export class WaitingRoomComponent implements OnInit, OnDestroy {

    private _numberOfPlayerMissing: number;
    private _onJoinedRoomSubscription: Subscription;
    private _onCancelationSubscription: Subscription;

    public get numberOfPlayerMissing(): number {
        return this._numberOfPlayerMissing;
    }

    constructor(
        private router: Router,
        private socketService: SocketService) {
            this._numberOfPlayerMissing = this.socketService.missingPlayers;
    }

    ngOnInit() {
        if (this.socketService.player.username === "") {
            this.router.navigate(["/"]);
        }
        this.socketService.subscribeToChannelEvent(SocketEventType.CONNECT_ERROR)
            .subscribe(this.onConnectionError);
        this._onJoinedRoomSubscription = this.onJoinedRoom();
        this._onCancelationSubscription = this.onCancelation();
    }

    ngOnDestroy() {
        // unsubscribe to all the listening events
        this._onJoinedRoomSubscription.unsubscribe();
        this._onCancelationSubscription.unsubscribe();
    }

    // A callback function when the server is not reachable.
    public onConnectionError() {
        console.log("Connection Error: The server is not reachable");
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.JOIN_ROOM)
            .subscribe((roomMessage: IRoomMessage) => {
                console.log("Joined the waiting room", roomMessage);
                if (roomMessage._roomIsReady) {
                    console.log("redirecting...");
                    this.router.navigate(["/game-room"]);
                } else {
                    this._numberOfPlayerMissing = roomMessage._numberOfMissingPlayers;
                }
            });
    }

    // A callback when the player join a room
    private onCancelation(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.PLAYER_CANCELED)
            .subscribe((roomMessage: IRoomMessage) => {
                console.log("Leaved the room", roomMessage);
                if (!roomMessage._roomIsReady && roomMessage._username !== this.socketService.player.username) {
                    this._numberOfPlayerMissing = roomMessage._numberOfMissingPlayers;
                }
            });
    }

    @HostListener("window:keydown.Escape", ['$event'])
    keyboardEventHandler(event: KeyboardEvent) {
        console.log(SocketEventType.CANCEL, this.socketService.player.username);
        this.socketService.emitMessage(SocketEventType.CANCEL, {
            username: this.socketService.player.username
        });
        this.router.navigate(["/"]);
    }
}

