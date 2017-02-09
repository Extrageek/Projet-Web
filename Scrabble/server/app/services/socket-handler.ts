import * as http from "http";
import * as io from "socket.io";

import { SocketEventType } from '../commons/socket-eventType';
import { RoomHandler } from "../services/room-handler";
import { Player } from "../models/Player";

export class SocketConnectionHandler {

    private _roomHandler: RoomHandler;
    private _socket: any;

    constructor(server: http.Server) {

        if (server === null || typeof (server) === "undefined") {
            throw new Error("Invalid server parameter.");
        }

        this._socket = io.listen(server);
        this._roomHandler = new RoomHandler();
        this.onConnectionRequest();
    }

    private onConnectionRequest() {
        this._socket.sockets.on(SocketEventType.connection, (socket: SocketIOClient.Socket) => {
            this.onNewGameRequest(socket);
        });
    }

    private onNewGameRequest(socket: any) {
        socket.on(SocketEventType.newGameRequest, (connectionInfos: { username: string, gameType: number }) => {

            if (typeof (connectionInfos) !== "object"
                || typeof (connectionInfos.username) !== "string"
                || typeof (connectionInfos.gameType) !== "number") {

                //console.log("invalid newGameRequest request");
                socket.emit(SocketEventType.invalidRequest);
            }
            else {

                // TODO: We can handle this in the client side and remove the if statement.
                let regularExpression = new RegExp('^[A-Za-z0-9]+$');

                if (regularExpression.test(connectionInfos.username)) {

                    let player = new Player(connectionInfos.username, connectionInfos.gameType, socket);

                    // TODO: Use the roomHandler to check if the username is available before trying to add the player
                    let playerRoom = this._roomHandler.addPlayer(player);

                    if (playerRoom !== null) {

                        let roomMessage = {
                            username: player.username,
                            roomNumber: playerRoom.roomNumber,
                            numberOfMissingPlayers: playerRoom.numberOfMissingPlayers(),
                            roomIsReady: false,
                            message: ""
                        };

                        //console.log(" Message - Session info: ", roomMessage);

                        socket.join(playerRoom.roomId);

                        console.log(socket.id, " joined room");

                        if (!playerRoom.roomIsFull()) {
                            roomMessage.message = `${connectionInfos.username}` + ` join the room`;

                            // Emit to all the player in the room.
                            this._socket.in(playerRoom.roomId).emit(SocketEventType.joinRoom, roomMessage);

                        } else {
                            roomMessage.message = `${connectionInfos.username}` + ` join the room`;

                            // Emit to all the player in the room.
                            this._socket.in(playerRoom.roomId).emit(SocketEventType.roomReady, roomMessage);
                        }
                    }
                    else {

                        // Emit only to the sender
                        socket.emit(SocketEventType.usernameAlreadyExist);
                    }
                }
                else {
                    socket.emit(SocketEventType.invalidUsername);
                }
            }
        });
    }
}
