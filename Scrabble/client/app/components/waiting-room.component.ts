import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IRoomMessage } from "../commons/messages/room-message.interface";

@Component({
    moduleId: module.id,
    selector: "waiting-room-selector",
    templateUrl: "../../assets/templates/waiting-room.html"
})

export class WaitingRoomComponent implements OnInit, OnDestroy {

    private _username = "";
    private _numberOfPlayerMissing: number;
    private _onJoinedRoomSubscription: Subscription;

    constructor(private router: Router, private socketService: SocketService) {
        // Default constructor
            console.log(this.socketService.player.numberOfPlayers);
            this._numberOfPlayerMissing = this.socketService.player.numberOfPlayers;

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
                    this.socketService.emitMessage(SocketEventType.INITIALIZE_EASEL, this._username);
                    this.router.navigate(["/game-room", this._username]);
                } else {
                    this._numberOfPlayerMissing = roomMessage._numberOfMissingPlayers;
                }
            });
    }
}
