import * as http from "http";
import * as io from "socket.io";

import { Room } from '../models/room';

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
                // Check if the username is already taken or not
                if (this._roomHandler.getPlayerByUsername(connectionInfos.username) === null) {

                    // Create a new player and return his new room.
                    let player = new Player(connectionInfos.username, connectionInfos.gameType);
                    let playerRoom = this._roomHandler.addPlayer(player);

                    // Join the room
                    socket.join(playerRoom.roomId);

                    this.sendWelcomeMessageOnPlayerJoinedRoom(player.username, playerRoom);
                }
                else {
                    // Emit only to the sender
                    socket.emit(SocketEventType.usernameAlreadyExist);
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

    private sendWelcomeMessageOnPlayerJoinedRoom(username: string, room: Room) {

        // Create a response for the room members
        let roomResponseMessage = {
            username: username,
            roomId: room.roomId,
            numberOfMissingPlayers: room.numberOfMissingPlayers(),
            roomIsReady: false,
            message: ""
        };

        if (!room.isFull()) {
            roomResponseMessage.message = `${username}` + ` join the room`;

            // Emit to all the player in the room.
            this._socket.to(room.roomId).emit(SocketEventType.joinRoom, roomResponseMessage);

        } else {
            roomResponseMessage.message = `${username}` + ` join the room`;
            roomResponseMessage.roomIsReady = true;

            // Emit a message to all the player in the room.
            this._socket.to(room.roomId).emit(SocketEventType.roomReady, roomResponseMessage);
        }
    }
}
