import * as http from "http";
import * as io from "socket.io";

import { RoomHandler } from "../../services/rooms/room-handler";
import { Room } from '../../models/rooms/room';
import { Player } from "../../models/players/Player";
import { Letter } from '../../models/lettersBank/letter';
import { SocketEventType } from '../../commons/socket-eventType';

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

            console.log("a new connection to the server", socket.id);

            this.onNewGameRequest(socket);
            this.onMessage(socket);
            this.onDisconnect(socket);
            this.onExchangeLetters(socket);
        });
    }

    // En event when a player ask for a new game
    private onNewGameRequest(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

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
                    let player = new Player(connectionInfos.username, connectionInfos.gameType, socket.id);
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

    // Handle a message sent by a member of a room
    private onMessage(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.message, (chatMessage: { username: string, message: string }) => {
            let currentRoom = this._roomHandler.getRoomByUsername(chatMessage.username);

            console.log("Room message :", chatMessage);

            if (currentRoom == null || currentRoom === undefined) {
                // TODO: Maybe emit an error to the sender
                throw new Error("Error, we should not be here, never, ever");
            }

            this._socket.in(currentRoom.roomId).emit(SocketEventType.message, chatMessage);
        });
    }

    // Use to send a message to a specific room members
    private sendWelcomeMessageOnPlayerJoinedRoom(username: string, room: Room) {

        if (username === null) {
            throw new Error("The username cannot be null.");
        }

        if (room === null) {
            throw new Error("The romm cannot be null.");
        }

        // Create a response for the room members
        let roomResponseMessage = {
            'username': username,
            'roomId': room.roomId,
            'numberOfMissingPlayers': room.numberOfMissingPlayers(),
            'roomIsReady': false,
            'message': `${username}` + ` join the room`
        }

        if (!room.isFull()) {
            // Emit to all the player in the room.
            this._socket.to(room.roomId).emit(SocketEventType.joinRoom, roomResponseMessage);

        } else {
            roomResponseMessage.roomIsReady = true;

            // Emit a message to all the player in the room.
            this._socket.to(room.roomId).emit(SocketEventType.roomReady, roomResponseMessage);
        }
    }

    // On player disconnect event
    private onDisconnect(socket: SocketIO.Socket) {

        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.disconnect, () => {

            let leavingPlayer = this._roomHandler.getPlayerBySocketId(socket.id);
            let playerRoom = this._roomHandler.getRoomByUsername(leavingPlayer.username);

            if (leavingPlayer !== null
                && leavingPlayer !== undefined
                && playerRoom !== null
                && playerRoom !== undefined) {

                playerRoom.removePlayer(leavingPlayer);

                if (playerRoom.players.length === 0) {
                    this._roomHandler.removeRoom(playerRoom);

                    // TODO: This should be handle in a next User Story from the Backlog
                    // Keep this for now

                } else {

                    // TODO: This should be handle in a next User Story from the Backlog
                    // Keep this for now

                    // Create a response for the room members
                    let roomResponseMessage = {
                        'username': leavingPlayer.username,
                        'roomId': playerRoom.roomId,
                        'numberOfMissingPlayers': playerRoom.numberOfMissingPlayers(),
                        'roomIsReady': false,
                        'message': `${leavingPlayer.username}` + ` leave the room`
                    }

                    console.log("Room not empty", playerRoom);
                    // Emit a message for the other players in the room.
                    this._socket.to(playerRoom.roomId).emit(SocketEventType.leaveRoom, roomResponseMessage);
                }

                console.log("player disconnected");
            }
        });
    }

    // Use to exchange the letters of a player
    private onExchangeLetters(socket: SocketIO.Socket) {

        //console.log("A request to change letters");

        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.exchangeLettersRequest, (letterToBeChanged: Array<string>) => {

            //console.log("Letters to be changed:", letterToBeChanged);

            if (letterToBeChanged === null) {
                throw new Error("The letters to be changed cannot be null");
            }

            let changedLetters = this._roomHandler.exchangeLetterOfCurrentPlayer(socket.id, letterToBeChanged);
            let playerRoom = this._roomHandler.getRoomBySocketId(socket.id);


            //console.log("Exchange letter request:", changedLetters);

            if (playerRoom !== null
                && changedLetters !== null
                && changedLetters.length === letterToBeChanged.length) {

                // Emit a message with the new letters to the sender
                socket.emit(SocketEventType.exchangedLetter, changedLetters);
            } else {
                throw new Error("An error occured when trying to exchange the letters");
            }

        });
    }

}
