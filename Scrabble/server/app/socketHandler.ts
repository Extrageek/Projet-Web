import * as http from "http";
import * as io from "socket.io";
import { SocketCanalNames } from "./SocketCanalNames";
import { RoomHandler, Player } from "./RoomsAndPlayers";

export class IoConnection {

    private _roomHandler: RoomHandler;

    constructor(server: http.Server) {
        if (server === null || typeof(server) === "undefined") {
            throw new Error("Invalid server parameter.");
        }
        let connection = io.listen(server);
        connection.sockets.on(SocketCanalNames.CONNECTION, this.onPlayerConnection);
        this._roomHandler = new RoomHandler();
    }

    private onPlayerConnection(socket: SocketIO.Socket) {
        const INVALID_NAME = 0;
        const NAME_ALREADY_EXISTS = 1;
        socket.on(SocketCanalNames.NEW_GAME_DEMAND, (demandInfo: {name: String, numberOfPlayers: number}) => {
            let regularExpression = new RegExp('^[A-Za-z0-9]$');
            if (regularExpression.test(name)) {
                let player = new Player(demandInfo.name, demandInfo.numberOfPlayers, socket);
                if (!this._roomHandler.hasPlayerWithNameOrSocket(player)) {
                    this._roomHandler.addPlayertoARoom(player);
                }
                else {
                    socket.emit(SocketCanalNames.NAME_ALREADY_EXISTS, NAME_ALREADY_EXISTS);
                }
            }
            else {
                socket.emit(SocketCanalNames.INVALID_NAME, INVALID_NAME);
            }
        });
    }
}
