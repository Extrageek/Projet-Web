import * as http from 'http';
import * as io from 'socket.io';
import { Player } from './Player';
import { RoomHandler } from './RoomHandler';

export class IoConnection {

    constructor(server: http.Server) {
        let connection = io.listen(server);
        connection.sockets.on("connection", this.onPlayerConnection);
    }

    private onPlayerConnection(socket: SocketIO.Socket) {
        const INVALID_NAME = 0;
        const NAME_ALREADY_EXISTS = 1;
        socket.on("newGameDemand", (demandInfo: {name: String, numberOfPlayers: number}) => {
            let regularExpression = new RegExp('^[A-Za-z0-9]$');
            if (regularExpression.test(name)) {
                if (RoomHandler.hasPlayerWithName(name)) {
                    let player = new Player(demandInfo.name, demandInfo.numberOfPlayers, socket);
                    player.connectToARoom();
                }
                else {
                    socket.emit(String(NAME_ALREADY_EXISTS));
                }
            }
            else {
                socket.emit(String(INVALID_NAME));
            }
        });
    }
}
