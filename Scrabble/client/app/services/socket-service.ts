import { Injectable } from "@angular/core";
import * as io from "socket.io-client";

import { SocketEventType } from '../commons/socket-eventType';

const SERVER_PORT = 3002;

@Injectable()
export class SocketService {

    private static instance: SocketService = null;
    private static isCreating: Boolean = false;
    private _socket: SocketIOClient.Socket = null;
    private _serverUri: string = 'http://localhost:' + SERVER_PORT;

    static getInstance(): SocketService {

        if (SocketService.instance === null) {
            SocketService.isCreating = true;
            SocketService.instance = new SocketService();
            SocketService.isCreating = false;
        }
        return SocketService.instance;

    }

    constructor() {
        if (!SocketService.isCreating) {
            //this._socket.disconnect();
        }

        this._socket = io.connect(this._serverUri, { 'forceNew': true });
    }

    public suscribeToEvent(socketEventType: SocketEventType, callback: Function) {
        this._socket.once(socketEventType.toString(), callback);
    }

    public newGameRequest(playerName: string, gameType: string, ) {
        this._socket.emit(SocketEventType.newGameRequest,
            { username: playerName, gameType: Number.parseInt(gameType) });
    }

    public changeLettersRequest(lettersToBeChanged: Array<string>) {
        this._socket.emit(SocketEventType.exchangeLettersRequest, lettersToBeChanged);
    }

    sendMessage(username: string, message: string) {
        this._socket.emit(SocketEventType.message,
            { username: username, message: message });
    }

    public removeAllListeners() {
        this._socket.removeAllListeners();
    }
}
