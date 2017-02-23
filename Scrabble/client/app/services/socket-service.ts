import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from "socket.io-client";

import { SocketEventType } from '../commons/socket-eventType';

const SERVER_PORT = 3002;

@Injectable()
export class SocketService {

    static _socket: SocketIOClient.Socket = null;
    private _serverUri: string = 'http://localhost:' + SERVER_PORT;

    constructor() {
        if (SocketService._socket === null) {
            SocketService._socket = io.connect(this._serverUri, { 'forceNew': false });
        }
    }

    public emitMessage(socketEventType: SocketEventType, data: Object) {
        SocketService._socket.emit(socketEventType.toString(), data);
    }

    public subscribeToChannelEvent(socketEventType: SocketEventType) {
        let observable = new Observable((observer: any) => {

            SocketService._socket.on(socketEventType.toString(), (data: any) => {
                observer.next(data);
            });

            return () => {
                SocketService._socket.disconnect();
            };
        });
        return observable;
    }
}
