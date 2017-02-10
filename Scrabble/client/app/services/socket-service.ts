import { Injectable } from "@angular/core";
import * as io from "socket.io-client";

import { SocketEventType } from '../commons/socket-eventType';

const SERVER_PORT = 3002;

@Injectable()
export class SocketService {

    private _socket: SocketIOClient.Socket = null;
    private _serverUri: string = 'http://localhost:' + SERVER_PORT;

    constructor() {
        // if (this._socket !== null) {
        //     this._socket.disconnect();
        // }

        this._socket = io.connect(this._serverUri, );
    }

    public suscribeToEvent(socketEventType: SocketEventType, callback: Function) {
        this._socket.once(socketEventType.toString(), callback);
    }

    public addNewPlayer(playerName: string, gameType: string, ) {
        this._socket.emit(SocketEventType.newGameRequest,
            { username: playerName, gameType: Number.parseInt(gameType) });
    }

    sendMessage(username: string, message: string) {

        console.log(username, " send a new msg", message);
        this._socket.emit(SocketEventType.message,
            { username: username, message: message });
    }

    public removeAllListeners() {
        this._socket.removeAllListeners();
    }
}
