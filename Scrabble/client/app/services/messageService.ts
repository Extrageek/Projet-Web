// TODO  :CURRENTLY UNUSED; TRY TO REMOVE MESSAGE SERVICE FROM CHATROOM

import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
    private _messages: string[];

    submitMessage(message: HTMLInputElement) : string {
        if (message.value !== "") {
            let messageReceived = message.value;
            message.value = "";
            return messageReceived;
        }
    }

    get messages(): string[] {
        return this._messages;
    }
}
