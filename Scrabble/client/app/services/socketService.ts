import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
//import { SocketCanalNames } from "../../../server/app/SocketCanalNames";

const CONNECTION = "connection";
const DISCONNECTION = "disconnect";
//Message sent by the client when he wants to play a game
const NEW_GAME_DEMAND = "newGameDemand";
//Message sent by the server if the information sent are not valid
const INVALID_DEMAND = "invalidDemand";
//Message sent by the server if the name already exists
const NAME_OR_SOCKET_ALREADY_EXISTS = "errorNameExists";
//Message sent by the server if the name previously sended by the client is invalid
const INVALID_NAME = "errorInvalidName";
//Message sent by the server when the number of missing players to begin the game has changed
const PLAYERS_MISSING = "playersMissing";
const portNumber = 3002;


@Injectable()
export class SocketService {

    socket: SocketIOClient.Socket;

    constructor () {
        this.socket = io.connect("http://localhost:" + String(portNumber));
    }

    public sendNewDemandRequest(playerName: string, gameType: string, responseFunctions: Function[]) {
        console.log("pass here");
        this.socket.emit(NEW_GAME_DEMAND, {name: playerName, gameType: Number.parseInt(gameType)});
        this.socket.on(INVALID_NAME, responseFunctions[0]);
        this.socket.on(INVALID_DEMAND, responseFunctions[1]);
        this.socket.on(NAME_OR_SOCKET_ALREADY_EXISTS, responseFunctions[2]);
        this.socket.on(PLAYERS_MISSING, responseFunctions[3]);
    }
}
