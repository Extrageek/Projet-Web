import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from "@angular/core";
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
    messageArray: string[];
    username: string;

    connection: any; // TODO: Hell no!!!, Remove this please

    @ViewChild("scroll") private myScrollContainer: ElementRef;

    constructor(private route: ActivatedRoute, private socketService: SocketService) {
        this.messageArray = new Array<string>();
    }

    ngOnInit(): void {
        this.messageArray = new Array<string>();

        this.route.params.subscribe(params => {
            this.username = params['id'];
        });

        this.onJoinedRoom();
        this.onLeaveRoom();
        this.onReceivedMessage();
        // this.onChangedLettersReceived();
    }

    ngOnDestroy() {
        // TODO: unsubscribe all the event in the ngOnDestroy
    }

    // A callback fonction when the player receive a message
    onReceivedMessage() {

        this.socketService.subscribeToChannelEvent(SocketEventType.message)
            .subscribe((response: any) => {
                this.messageArray.push(response.message);

                console.log("Chat room: ", response.message);
            });
    }

    scrollToBottom() {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    // A callback function when the server is not reachable.
    public onConnectionError() {
        console.log("Chat room: Connection Error: The server is not reachable");
    }

    // A callback when the player join a room
    public onJoinedRoom(): void {

        this.socketService.subscribeToChannelEvent(SocketEventType.joinRoom)
            .subscribe((response: any) => {
                this.messageArray.push(response._message);

                console.log("Chat room:Joined ", response._message);
            });
    }

    // A callback when the player leave a room
    public onLeaveRoom(): void {

        this.socketService.subscribeToChannelEvent(SocketEventType.leaveRoom)
            .subscribe((response: any) => {
                this.messageArray.push(response._message);

                console.log("Chat room: Leave ", response._message);
            });
    }

    // A callback function when the room of the user is full and the game is ready to be started
    public onRoomReady(roomMessage: IRoomMessage): void {

        // For debug
        console.log("Chat room: Ready", roomMessage);
        //this.router.navigate(["/game-room", { id: roomMessage.username }]);
        //console.log("router must be called",this.router);
    }

    private onChangedLettersReceived() {

        this.socketService.subscribeToChannelEvent(SocketEventType.exchangedLetter)
            .subscribe((response: any) => {
                this.messageArray.push(response.message);

                console.log("Chat Room:", "Hey! I received new letters from the server: ", response);
            });
    }

    // A callback function when in case of invalid request.
    public onInvalidRequest() {
        console.log("The request sent to the server is invalid");
    }
}
