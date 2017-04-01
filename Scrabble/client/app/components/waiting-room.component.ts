import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IRoomMessage } from "../commons/messages/room-message.interface";

@Component({
    moduleId: module.id,
    selector: "waiting-room-selector",
    templateUrl: "../../assets/templates/waiting-room.html",
    styleUrls: ["./../../assets/stylesheets/waiting-room.css"]
})
export class WaitingRoomComponent implements OnInit, OnDestroy {
    // private _username = "";
    private _numberOfPlayerMissing: number;
    private _onJoinedRoomSubscription: Subscription;

    public get numberOfPlayerMissing(): number {
        return this._numberOfPlayerMissing;
    }

    constructor(
        private router: Router,
        private socketService: SocketService) {
        // Default constructor
        console.log(this.socketService.player);
        this._numberOfPlayerMissing = this.socketService.missingPlayers;
    }

    ngOnInit() {
        this._onJoinedRoomSubscription = this.onJoinedRoom();
    }

    ngOnDestroy() {
        // unsubscribe to all the listening events
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.JOIN_ROOM)
            .subscribe((roomMessage: IRoomMessage) => {
                console.log("Joined the room", roomMessage);
                if (roomMessage._roomIsReady) {
                    this.router.navigate(["/game-room"]);
                } else {
                    this._numberOfPlayerMissing = roomMessage._numberOfMissingPlayers;
                }
            });
    }

    // A callback when the player join a room
    private onLeavedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.LEAVE_ROOM)
            .subscribe((roomMessage: IRoomMessage) => {
                console.log("Leaved the room", roomMessage);
                if (!roomMessage._roomIsReady) {
                    this._numberOfPlayerMissing = roomMessage._numberOfMissingPlayers;
                }
            });
    }

    // @HostListener("document:keypress", ['$event'])
    // keyboardEventHandler(event: KeyboardEvent) {
    //     console.log(event.keyCode);
    //     this.socketService.emitMessage(SocketEventType.DISCONNECT, this._username);
    //     this.router.navigate(["/"]);
    // }
}

