import { Injectable } from "@angular/core";
import * as io from "socket.io-client";

//Message sent by the client when he wants to play a game
const NEW_GAME_DEMAND = "newGameDemand";
//Message sent by the server if the information sent are not valid
const INVALID_DEMAND = "invalidDemand";
//Message sent by the server if the name already exists
const NAME_OR_SOCKET_ALREADY_EXISTS = "errorNameExists";
//Message sent by the server if the name previously received by the client is invalid
const INVALID_NAME = "errorInvalidName";
//Message sent by the server when the number of missing players to begin the game has changed
const PLAYERS_MISSING = "playersMissing";

const SERVER_PORT_NUMBER = 3002;


@Injectable()
export class SocketService {

    socket: SocketIOClient.Socket;

    constructor () {
        this.socket = io.connect("http://localhost:" + String(SERVER_PORT_NUMBER));
    }

    public sendNewDemandRequest(playerName: string, gameType: string, responseFunctions: Function[]) {
        this.socket.emit(NEW_GAME_DEMAND, {name: playerName, gameType: Number.parseInt(gameType)});
        this.socket.removeAllListeners();
        this.socket.once(INVALID_NAME, responseFunctions[0]);
        this.socket.once(INVALID_DEMAND, responseFunctions[1]);
        this.socket.once(NAME_OR_SOCKET_ALREADY_EXISTS, responseFunctions[2]);
        this.socket.once(PLAYERS_MISSING, responseFunctions[3]);
    }
}
