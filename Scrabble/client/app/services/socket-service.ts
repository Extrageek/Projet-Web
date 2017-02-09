import { Injectable } from "@angular/core";
import * as io from "socket.io-client";

import { SocketEventType } from '../commons/socket-eventType';

const SERVER_PORT = 3002;

@Injectable()
export class SocketService {

    static _socket: SocketIOClient.Socket = null;
    private _serverUri: string = 'http://localhost:' + SERVER_PORT;

    constructor() {
        if (SocketService._socket !== null) {
            SocketService._socket.disconnect();
        }

        SocketService._socket = io.connect(this._serverUri, );
    }

    public sendNewGameRequest(playerName: string, gameType: string, responseFunctions: Function[]) {
        SocketService._socket.emit(SocketEventType.newGameRequest,
            { name: playerName, gameType: Number.parseInt(gameType) });
        SocketService._socket.removeAllListeners();
    }

    public suscribeToEvent(socketEventType: SocketEventType, callback: Function) {
        SocketService._socket.once(socketEventType.toString(), callback);
    }

    public addNewPlayer(playerName: string, gameType: string, ) {
        SocketService._socket.emit(SocketEventType.newGameRequest,
            { username: playerName, gameType: Number.parseInt(gameType) });
        //SocketService._socket.emit('test', { username: "playerName" });
    }

    sendMessage(message: string) {
        // let chatMessage = new ChatMessage(this._playerSessionInformations, message);
        // SocketService._socket.emit(SocketEventType.message, ChatMessage);
    }

    public removeAllListeners() {
        SocketService._socket.removeAllListeners();
    }
}
