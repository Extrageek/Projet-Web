import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'scrabble-chatroom-selector',
    templateUrl: '../../app/views/chatroom.html',
    styleUrls: ['../../app/assets/chatroom.css']
})
export class ChatroomComponent implements OnInit, AfterViewChecked {
    messageArray: string[];
    @ViewChild('scroll') private myScrollContainer: ElementRef;

    submitMessage(message: HTMLInputElement) {
        if (message.value !== "") {
            this.messageArray.push(message.value);
        }
        message.value = "";
    }
    constructor() {
        this.messageArray = [];
    }
    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {console.log(err); }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }
    ngOnInit() {
        //TODO;
    }
}
