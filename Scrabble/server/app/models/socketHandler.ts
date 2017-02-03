import * as http from "http";
import * as io from "socket.io";
import { SocketCanalNames } from "./SocketCanalNames";
import { RoomHandler } from "./RoomHandler";
import { Player } from "./Player";

export class IoConnection {

    private _roomHandler: RoomHandler;

    constructor(server: http.Server) {
        if (server === null || typeof(server) === "undefined") {
            throw new Error("Invalid server parameter.");
        }
        let connection = io.listen(server);
        this._roomHandler = new RoomHandler(connection);
        let roomHandler = this._roomHandler;
        connection.sockets.on(SocketCanalNames.CONNECTION, (socket: SocketIO.Socket) => {
            socket.on(SocketCanalNames.NEW_GAME_DEMAND, (demandInfo: {name: string, gameType: number}) => {
                if (typeof(demandInfo) !== "object" || typeof(demandInfo.name) !== "string"
                    || typeof(demandInfo.gameType) !== "number") {
                    socket.emit(SocketCanalNames.INVALID_DEMAND);
                }
                else {
                    let regularExpression = new RegExp('^[A-Za-z0-9]+$');
                    if (regularExpression.test(demandInfo.name)) {
                        let player = new Player(demandInfo.name, demandInfo.gameType, socket);
                        if (!roomHandler.hasPlayerWithNameOrSocket(player)) {
                            roomHandler.addPlayertoARoom(player);
                        }
                        else {
                            socket.emit(SocketCanalNames.NAME_OR_SOCKET_ALREADY_EXISTS);
                        }
                    }
                    else {
                        socket.emit(SocketCanalNames.INVALID_NAME);
                    }
                }
            });
        });
    }
}
