import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'scrabble-chatroom-selector',
    templateUrl: '../../app/views/chatroom.html',
    styleUrls: ['../../app/assets/chatroom.css'],
})
export class ChatroomComponent implements AfterViewChecked {
     messageArray: string[];

    @ViewChild('scroll') private myScrollContainer: ElementRef;

    constructor() {
        this.messageArray = [];
    }

    submitMessage(message: HTMLInputElement) : string {
        if (message.value !== "") {
            let messageReceived = message.value;
            message.value = "";
            return messageReceived;
        }
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {console.log(err); }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }
}
