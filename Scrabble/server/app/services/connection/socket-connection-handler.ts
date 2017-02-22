import * as http from "http";
import * as io from "socket.io";

import { RoomHandler } from "../../services/rooms/room-handler";
import { Room } from '../../models/rooms/room';
import { Player } from "../../models/players/Player";
import { Letter } from '../../models/lettersBank/letter';
import { SocketEventType } from '../../commons/socket-eventType';
import { IRoomMessage } from '../../models/rooms/room-message';

export class SocketConnectionHandler {

    _roomHandler: RoomHandler; // TODO: Find a way to make this private please
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

                    console.log(player);
                    let room = this._roomHandler.addPlayer(player);

                    // Join the room
                    socket.join(room.roomId);
                    this.sendWelcomeMessageOnPlayerJoinedRoom(player.username, room, socket);

                }
                else {
                    console.log("Already exists");
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

        socket.on(SocketEventType.message, (sentMessage: { username: string, message: string }) => {
            let currentRoom = this._roomHandler.getRoomByUsername(sentMessage.username);

            console.log("Room message :", sentMessage);

            if (currentRoom == null || currentRoom === undefined) {
                // TODO: Maybe emit an error to the sender
                throw new Error("Error, we should not be here, never, ever");
            }

            // Create a response for the room members
            let chatMessage: IRoomMessage = {
                _username: sentMessage.username,
                _roomId: currentRoom.roomId,
                _numberOfMissingPlayers: currentRoom.numberOfMissingPlayers(),
                _roomIsReady: currentRoom.isFull(),
                _message: sentMessage.message,
                _date: new Date()
            };

            this._socket.to(currentRoom.roomId).emit(SocketEventType.message, chatMessage);
        });
    }

    // Use to send a message to a specific room members
    private sendWelcomeMessageOnPlayerJoinedRoom(username: string, room: Room, socket:SocketIO.Socket) {

        if (username === null) {
            throw new Error("The username cannot be null.");
        }

        if (room === null) {
            throw new Error("The room cannot be null.");
        }

        // Create a response for the room members
        let roomMessage: IRoomMessage = {
            _username: username,
            _roomId: room.roomId,
            _numberOfMissingPlayers: room.numberOfMissingPlayers(),
            _roomIsReady: false,
            _message: `${username}` + ` joined the room`,
            _date: new Date()
        };

        console.log("send a request", username);

        // TODO: Don't remove this block , will be use for an other User Story from the Backlog
        /**************************/
        // if (room.isFull()) {
        //     roomMessage._roomIsReady = true;
        //     roomMessage._message = 'The room is ready';

        //     // Emit a message to all the player in the room.
        //     this._socket.in(room.roomId).emit(SocketEventType.roomReady, roomMessage);
        // }
        /*************************/

        // Emit to all the player in the room.
        socket.to(room.roomId).emit(SocketEventType.joinRoom, roomMessage);
    }

    // On player disconnect event
    private onDisconnect(socket: SocketIO.Socket) {

        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.disconnect, () => {

            let leavingPlayer = this._roomHandler.getPlayerBySocketId(socket.id);

            if (leavingPlayer !== null) {

                console.log("send a request", leavingPlayer.username);

                let playerRoom = this._roomHandler.getRoomByUsername(leavingPlayer.username);

                if (leavingPlayer !== null
                    && leavingPlayer !== undefined
                    && playerRoom !== null
                    && playerRoom !== undefined) {

                    playerRoom.removePlayer(leavingPlayer);

                    if (playerRoom.players.length === 0) {
                        this._roomHandler.removeRoom(playerRoom);
                        // TODO: Should be handle in a next User Story
                        // Maybe in a logger

                    } else {

                        // Create a response for the room members
                        let roomMessage: IRoomMessage = {
                            _username: leavingPlayer.username,
                            _roomId: playerRoom.roomId,
                            _numberOfMissingPlayers: playerRoom.numberOfMissingPlayers(),
                            _roomIsReady: false,
                            _message: `${leavingPlayer.username}` + ` left the room`,
                            _date: new Date()
                        };
                        console.log("Room not empty", playerRoom);

                        // Emit a message for the other players in the room.
                        this._socket.to(playerRoom.roomId).emit(SocketEventType.leaveRoom, roomMessage);
                    }

                    console.log("player disconnected");
                }
            }
        });
    }

    // Use to exchange the letters of a player
    private onExchangeLetters(socket: SocketIO.Socket) {

        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.exchangeLettersRequest, (letterToBeChanged: Array<string>) => {

            if (letterToBeChanged === null) {
                throw new Error("The letters to be changed cannot be null");
            }

            let changedLetters = this._roomHandler.exchangeLetterOfCurrentPlayer(socket.id, letterToBeChanged);
            let playerRoom = this._roomHandler.getRoomBySocketId(socket.id);

            console.log("Letters to be echanged", socket.id, "-", letterToBeChanged);
            console.log(playerRoom, " - ", changedLetters);

            if (playerRoom !== null
                && changedLetters !== null
                && changedLetters.length === letterToBeChanged.length) {

                // Emit a message with the new letters to the sender
                socket.emit(SocketEventType.exchangedLetter, changedLetters);

                console.log("exchanged letters: ", changedLetters);

            } else {
                throw new Error("An error occured when trying to exchange the letters");
            }
        });
    }
}
