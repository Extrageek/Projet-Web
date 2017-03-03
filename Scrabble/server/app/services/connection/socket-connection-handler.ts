import * as http from "http";
import * as io from "socket.io";

import { RoomHandler } from "../../services/rooms/room-handler";
import { Room } from "../../models/rooms/room";
import { Player } from "../../models/players/Player";
import { Letter } from "../../models/lettersBank/letter";
import { SocketEventType } from "../../commons/socket-eventType";
import { CommandType } from "../../commons/command-type";
import { CommandStatus } from "../../commons/command-status";
import { IRoomMessage } from "../../commons/messages/room-message";
import { ICommandMessage } from "../../commons/messages/command-message";

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

            try {
                this.onNewGameRequest(socket);
                this.onMessage(socket);
                this.onDisconnect(socket);
                this.onExchangeLetters(socket);
                this.onCommandRequest(socket);

            } catch (error) {
                this._socket.emit(SocketEventType.connectError);
            }
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

    // Use to send a message to a specific room members
    private sendWelcomeMessageOnPlayerJoinedRoom(username: string, room: Room, socket: SocketIO.Socket) {

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
            _roomIsReady: room.isFull(),
            _message: `${username}` + ` joined the room`,
            _date: new Date(),
            _commandType: CommandType.MessageCmd
        };

        // Emit to all the player in the room.
        this._socket.to(room.roomId).emit(SocketEventType.joinRoom, roomMessage);
    }

    // Handle a message sent by a member of a room
    private onMessage(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket
        .on(SocketEventType.message, (sentMessage: { commandType: CommandType, username: string, message: string }) => {
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
                _date: new Date(),
                _commandType: sentMessage.commandType
            };

            this._socket.to(currentRoom.roomId).emit(SocketEventType.message, chatMessage);
        });
    }

    // Use to exchange the letters of a player
    private onExchangeLetters(socket: SocketIO.Socket) {

        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.changeLettersRequest,
            (sentMessage: { commandType: CommandType, listOfLettersToChange: Array<string> }) => {

                if (sentMessage.listOfLettersToChange === null) {
                    throw new Error("The letters to be changed cannot be null");
                }

                let changedLetters =
                this._roomHandler.exchangeLetterOfCurrentPlayer(socket.id, sentMessage.listOfLettersToChange);

                let playerRoom = this._roomHandler.getRoomBySocketId(socket.id);

                if (playerRoom !== null
                    && changedLetters !== null
                    && changedLetters.length === sentMessage.listOfLettersToChange.length) {

                    let player = this._roomHandler.getPlayerBySocketId(socket.id);
                    let message = `$: <!changer` + ' ' + `${sentMessage.listOfLettersToChange.toString()}>`;

                    let commandMessage: ICommandMessage<Array<string>> = {
                        _commandStatus: CommandStatus.Ok,
                        _date: new Date(),
                        _message: message,
                        _data: changedLetters,
                        _username: player.username,
                        _commandType: sentMessage.commandType
                    };
                    // Emit a message with the new letters to the sender
                    this._socket.to(playerRoom.roomId).emit(SocketEventType.changeLettersRequest, commandMessage);
                } else {
                    throw new Error("An error occured when trying to exchange the letters");
                }
            });
    }

    private onCommandRequest(socket: SocketIO.Socket) {

        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.commandRequest,
            (commandRequest: { commandType: CommandType, commandStatus: CommandStatus, data: string }) => {
                let playerRoom = this._roomHandler.getRoomBySocketId(socket.id);
                let player = this._roomHandler.getPlayerBySocketId(socket.id);
                let message = `$: ${CommandStatus[commandRequest.commandStatus]}` + ': ' + `<${commandRequest.data}>`;

                let commandMessage: ICommandMessage<string> = {
                    _commandStatus: commandRequest.commandStatus,
                    _date: new Date(),
                    _message: message,
                    _data: null,
                    _username: player.username,
                    _commandType: commandRequest.commandType
                };

                // Emit a message with the new letters to the sender
                this._socket.to(playerRoom.roomId).emit(SocketEventType.commandRequest, commandMessage);
            });
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
                            _date: new Date(),
                            _commandType: null,
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
}
