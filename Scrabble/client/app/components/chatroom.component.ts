import { Component, AfterViewChecked, ElementRef, ViewChild } from "@angular/core";

import { SocketService } from "../services/socket-service";
import { SocketEventType } from '../commons/socket-eventType';

@Component({
    moduleId: module.id,
    selector: "scrabble-chatroom-selector",
    templateUrl: "../../app/views/chatroom.html",
    styleUrls: ["../../app/assets/chatroom.css"],

    /*FOR TESTING PURPOSES ONLY*/
    //         template: `
    //     <div class = "chatContainer">
    //         <div class = "chatTitle">Chat Room</div>
    //         <div #scroll class = "chatMessageBox">
    //             <div class= "individualMessages" *ngFor="let message of messageArray">{{message}}</div>
    //         </div>
    //             <div class = "chatTextBox">
    //             <form autocomplete="off">
    //                 <input #message (keyup.enter) = "submitMessage(message)"
    //                 id="inputMessage" type="text" placeholder="Enter your message" />
    //                 <input (mousedown) = "submitMessage(message)" id="submitMessage" type="submit" value="Send"/>
    //             </form>
    //         </div>
    //     </div>`

    providers: [SocketService]
})

export class ChatroomComponent implements AfterViewChecked {
    messageArray: string[];

    @ViewChild("scroll") private myScrollContainer: ElementRef;

    constructor(private socketService: SocketService) {
        this.messageArray = [];
    }

    submitMessage(message: HTMLInputElement) {
        if (message.value !== "") {
            this.socketService.sendMessage(message.value);
        }
        message.value = "";
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
}
