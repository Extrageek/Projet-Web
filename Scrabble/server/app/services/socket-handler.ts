import * as http from "http";
import * as io from "socket.io";

import { SocketEventType } from '../commons/socket-eventType';
import { RoomHandler } from "../services/room-handler";
import { Player } from "../models/Player";

export class SocketConnectionHandler {

    private _roomHandler: RoomHandler;
    private _socket: SocketIO.Server;

    constructor(server: http.Server) {

        if (server === null || typeof (server) === "undefined") {
            throw new Error("Invalid server parameter.");
        }

        this._socket = io.listen(server);
        this._roomHandler = new RoomHandler();
        this.onConnectionRequest();
    }

    private onConnectionRequest() {
        this._socket.sockets.on(SocketEventType.connection, (socket: SocketIO.Socket) => {

            console.log("a new connection to the server");

            this.onNewGameRequest(socket);
            this.onMessage(socket);
        });
    }

    private onNewGameRequest(socket: SocketIO.Socket) {
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

                    // Check if the username is already taken or not
                    if (this._roomHandler.getPlayerByUsername(connectionInfos.username) === null) {

                        // Create a new player and return his new room.
                        let player = new Player(connectionInfos.username, connectionInfos.gameType);
                        let playerRoom = this._roomHandler.addPlayer(player);

                        // Create a response for the room members
                        let roomResponseMessage = {
                            username: player.username,
                            roomId: playerRoom.roomId,
                            numberOfMissingPlayers: playerRoom.numberOfMissingPlayers(),
                            roomIsReady: false,
                            message: ""
                        };

                        // Join the room
                        socket.join(playerRoom.roomId);

                        //console.log(socket.id, " joined room");

                        if (!playerRoom.isFull()) {
                            roomResponseMessage.message = `${connectionInfos.username}` + ` join the room`;

                            // Emit to all the player in the room.
                            this._socket.to(playerRoom.roomId).emit(SocketEventType.joinRoom, roomResponseMessage);

                        } else {
                            roomResponseMessage.message = `${connectionInfos.username}` + ` join the room`;
                            roomResponseMessage.roomIsReady = true;

                            // Emit a message to all the player in the room.
                            this._socket.to(playerRoom.roomId).emit(SocketEventType.roomReady, roomResponseMessage);
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

    private onMessage(socket: SocketIO.Socket) {
        socket.on(SocketEventType.message, (chatMessage: { username: string, message: string }) => {
            let currentRoom = this._roomHandler.getRoomByUsername(chatMessage.username);

            console.log("Room message :", chatMessage);

            if (currentRoom == null || currentRoom === undefined) {
                // TODO: Maybe emit an error to the sender
                throw new Error("");
            }

            this._socket.to(currentRoom.roomId).emit(SocketEventType.message, chatMessage);

        });
    }
}
