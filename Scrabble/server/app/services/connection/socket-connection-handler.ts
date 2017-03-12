import * as http from "http";
import * as io from "socket.io";

import { RoomHandler } from "../../services/rooms/room-handler";
import { Room } from "../../models/rooms/room";
import { Player } from "../../models/players/Player";
import { Letter } from "../../models/lettersBank/letter";

import { SocketEventType } from "./socket-eventType";
import { CommandType } from "../commons/command-type";
import { CommandStatus } from "../commons/command-status";
import { MessageHandler } from "../messages/message-handler";
import { ICommandMessage } from "../messages/commons/command-message.interface";
import { IRoomMessage } from "../messages/commons/room-message.interface";

export class SocketConnectionHandler {

    private _roomHandler: RoomHandler;
    private _messageHandler: MessageHandler;
    private _socket: SocketIO.Server;

    constructor(server: http.Server) {

        if (server === null || typeof (server) === "undefined") {
            throw new Error("Invalid server parameter.");
        }

        this._roomHandler = new RoomHandler();
        this._messageHandler = new MessageHandler();
        this._socket = io.listen(server);
        this.initializeListeners();
    }

    private initializeListeners() {
        this._socket.sockets.on(SocketEventType.connection, (socket: SocketIO.Socket) => {
            // console.log("a new connection to the server", socket.id);

            try {

                // TODO: Leave this please, I'm working on it

                // let clientUrl = socket.handshake.headers.referer.toString().split('/');
                // let lastParameter = clientUrl[clientUrl.length - 1];
                // console.log("username from socket", lastParameter);
                // if (lastParameter !== null) {
                //     let player = this._roomHandler.getPlayerByUsername(lastParameter);
                //     if (player !== null) {
                //         console.log("currentId", player.socketId, "newId", socket.id);
                //         player.socketId = socket.id;
                //     }
                // }

                this.subscribeToNewGameRequestEvent(socket);
                this.subscribeToInitializeEaselEvent(socket);
                this.subscribeToMessageEvent(socket);
                this.subscribeToExchangeLettersEvent(socket);
                this.subscribeToPlaceWordEvent(socket);
                this.subscribeToPassEvent(socket);
                this.subscribeToInvalidCommandEvent(socket);
                this.subscribeToDisconnectEvent(socket);

            } catch (error) {
                this._socket.emit(SocketEventType.connectError);
            }
        });
    }

    private subscribeToNewGameRequestEvent(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

            
        socket.on(SocketEventType.newGameRequest, (connectionInfos: { username: string, gameType: number }) => {

            console.log("new game request", socket.id);

            if (typeof (connectionInfos) !== "object"
                || typeof (connectionInfos.username) !== "string"
                || typeof (connectionInfos.gameType) !== "number") {

                //console.log("invalid newGameRequest request");
                socket.emit(SocketEventType.invalidRequest);
            }
            else {

                if (this._roomHandler.getPlayerByUsername(connectionInfos.username) === null) {

                    // Create a new player and get his room id
                    let player = new Player(connectionInfos.username, connectionInfos.gameType, socket.id);
                    let room = this._roomHandler.addPlayer(player);
                    let message = `${player.username}` + ` joined the room`;

                    // Create the response to send
                    let response = this._messageHandler.createRoomMessageResponse(player.username, room, message);
                    socket.join(response._roomId);

                    // Emit to all the player in the room.
                    this._socket.to(response._roomId).emit(SocketEventType.joinRoom, response);

                } else {
                    console.log("Already exists");
                    // Emit only to the sender
                    socket.emit(SocketEventType.usernameAlreadyExist);
                }
            }
        });
    }

    private subscribeToMessageEvent(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }
        socket.on(SocketEventType.message, (data: {
            commandType: CommandType,
            message: string
        }) => {
            let player = this._roomHandler.getPlayerBySocketId(socket.id);
            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let response = this._messageHandler.createRoomMessageResponse(player.username, room, data.message);

            if (response !== null) {
                this._socket.to(response._roomId).emit(SocketEventType.message, response);

            } else {
                this._socket.to(response._roomId).emit(SocketEventType.invalidRequest);
            }
        });
    }

    // A listener for an Exchange letter request
    private subscribeToExchangeLettersEvent(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }
        socket.on(SocketEventType.changeLettersRequest, (request: {
            commandType: CommandType,
            commandStatus: CommandStatus
            data: Array<string>
        }) => {

            let newLettersToSend = this._roomHandler.exchangeLetterOfCurrentPlayer(socket.id, request.data);
            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let player = this._roomHandler.getPlayerBySocketId(socket.id);

            let response = this._messageHandler
                .createExchangeLettersResponse(
                player.username,
                room,
                request.commandStatus,
                request.data,
                newLettersToSend);

            if (response !== null) {
                this._socket.to(room.roomId).emit(SocketEventType.commandRequest, response);
                // Emit a message with the new letters to the sender
                this._socket.to(room.roomId).emit(SocketEventType.changeLettersRequest, response);

                if (response._commandStatus === CommandStatus.Ok) {
                    // Update the players queues for everyone in the room
                    let playersQueues = room.getAndUpdatePlayersQueue();
                    this._socket.to(room.roomId).emit(SocketEventType.updatePlayersQueue, playersQueues);
                }

            } else {
                socket.emit(SocketEventType.invalidRequest);
            }
        });
    }

    private subscribeToPlaceWordEvent(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.placeWordCommandRequest, (data: {
            commandType: CommandType, commandStatus: CommandStatus, data: Array<string>
        }) => {

            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let player = this._roomHandler.getPlayerBySocketId(socket.id);
            let response = this._messageHandler.createPlaceWordResponse(player.username, room, data.commandStatus, data.data);

            if (response !== null) {
                // Emit a message with the new letters to the sender
                this._socket.to(response._room.roomId).emit(SocketEventType.commandRequest, response);
                this._socket.to(response._room.roomId).emit(SocketEventType.placeWordCommandRequest, response);

                if (response._commandStatus === CommandStatus.Ok) {
                    // Update the players queues for everyone in the room
                    let playersQueues = room.getAndUpdatePlayersQueue();
                    this._socket.to(room.roomId).emit(SocketEventType.updatePlayersQueue, playersQueues);
                }

            } else {
                // TODO:
            }
        });
    }

    private subscribeToPassEvent(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }
        socket.on(SocketEventType.passCommandRequest, (request: {
            commandType: CommandType, commandStatus: CommandStatus, data: string
        }) => {

            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let player = this._roomHandler.getPlayerBySocketId(socket.id);
            let response = this._messageHandler
                .createCommandResponse(
                player.username,
                room,
                request.commandType,
                request.commandStatus,
                request.data);

            if (response !== null) {

                // Emit a message with the new letters to the sender
                this._socket.to(room.roomId).emit(SocketEventType.commandRequest, response);

                // Update the players queues for everyone in the room
                let playersQueues = room.getAndUpdatePlayersQueue();
                this._socket.to(room.roomId).emit(SocketEventType.updatePlayersQueue, playersQueues);

            } else {
                // TODO:
            }
        });
    }

    private subscribeToInvalidCommandEvent(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }
        socket.on(SocketEventType.invalidCommandRequest, (request: {
            commandType: CommandType, commandStatus: CommandStatus, data: string
        }) => {

            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let player = this._roomHandler.getPlayerBySocketId(socket.id);
            let response = this._messageHandler
                .createCommandResponse(
                player.username,
                room,
                request.commandType,
                request.commandStatus,
                request.data);

            if (response !== null) {
                // Emit a message with the new letters to the sender
                this._socket.to(response._room.roomId).emit(SocketEventType.commandRequest, response);
            } else {
                // TODO:
            }
        });
    }

    // Use to inialize the easel of the player
    private subscribeToInitializeEaselEvent(socket: SocketIO.Socket) {

        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.initializeEasel,
            (username: string) => {

                if (username === null) {
                    throw new Error("The letters to be changed cannot be null");
                }

                let room = this._roomHandler.getRoomBySocketId(socket.id);
                if (room !== null) {
                    let initialsLetters = room.getInitialsLetters();

                    // Emit a message with the new letters to the sender
                    socket.emit(SocketEventType.initializeEasel, initialsLetters);

                    // Update the players queue for everyone in the room
                    let playersQueues = room.getAndUpdatePlayersQueue();
                    this._socket.to(room.roomId).emit(SocketEventType.updatePlayersQueue, playersQueues);

                } else {
                    throw new Error("An error occured when trying to exchange the letters");
                }
            });
    }

    // On player disconnect event
    private subscribeToDisconnectEvent(socket: SocketIO.Socket) {

        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }

        socket.on(SocketEventType.disconnect, () => {
            let leavingPlayer = this._roomHandler.getPlayerBySocketId(socket.id);
            if (leavingPlayer !== null) {

                let playerRoom = this._roomHandler.getRoomByUsername(leavingPlayer.username);

                if (leavingPlayer !== null
                    && leavingPlayer !== undefined
                    && playerRoom !== null
                    && playerRoom !== undefined) {

                    playerRoom.removePlayer(leavingPlayer);

                    if (playerRoom.players.count === 0) {
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
