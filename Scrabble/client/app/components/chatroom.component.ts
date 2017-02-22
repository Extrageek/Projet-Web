import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';

import { Route, ActivatedRoute } from '@angular/router';
import { SocketService } from "../services/socket-service";
import { SocketEventType } from '../commons/socket-eventType';
import { IRoomMessage } from '../models/room/room-message';

@Component({
    moduleId: module.id,
    selector: "scrabble-chatroom-selector",
    templateUrl: "../../assets/templates/chatroom.html",
    styleUrls: ["../../assets/stylesheets/chatroom.css"],
    providers: [SocketService]
})

export class ChatroomComponent implements AfterViewChecked, OnInit, OnDestroy {
    _messageArray: Array<IRoomMessage>;
    _username: string;

    private _onJoinedRoom: Subscription;
    private _onLeaveRoom: Subscription;
    private _onReceivedMessage: Subscription;

    @ViewChild("scroll") private myScrollContainer: ElementRef;

    constructor(private route: ActivatedRoute, private socketService: SocketService) {
        this._messageArray = new Array<IRoomMessage>();
    }

    ngOnInit(): void {
        this._messageArray = new Array<IRoomMessage>();

        this.route.params.subscribe(params => {
            this._username = params['id'];
        });

        // Subscribe to event by calling the related method and save them for unsubsciption OnDestroy
        this._onJoinedRoom = this.onJoinedRoom();
        this._onLeaveRoom = this.onLeaveRoom();
        this._onReceivedMessage = this.onReceivedMessage();
    }

    ngOnDestroy() {
        // unsubscribe to all the listening events
        this._onJoinedRoom.unsubscribe();
        this._onLeaveRoom.unsubscribe();
        this._onReceivedMessage.unsubscribe();
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.joinRoom)
            .subscribe((response: IRoomMessage) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    console.log("Chat room:Joined ", response._message);
                }
            });
    }

    // A callback when the player leave a room
    public onLeaveRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.leaveRoom)
            .subscribe((response: IRoomMessage) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    console.log("Chat room: Leave ", response._message);
                }
            });
    }

    // A callback fonction when the player receive a message
    private onReceivedMessage(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.message)
            .subscribe((response: any) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response as IRoomMessage);
                    console.log("Chat room: ", response.message, response.date);
                }
            });
    }

    // Use to add a scroller to the chatroom
    private scrollToBottom() {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    // Use to help the user when scrolling
    ngAfterViewChecked() {
        this.scrollToBottom();
    }
}
