import * as http from "http";
import * as io from "socket.io";

import { RoomHandler } from "../../services/rooms/room-handler";
import { Room } from "../../models/rooms/room";
import { Player } from "../../models/players/Player";
import { Letter } from "../../models/lettersBank/letter";

import { SocketEventType } from "./socket-eventType";

import { CommandType } from "../commons/command-type";
import { CommandStatus } from "../commons/command-status";
import { ICommandRequest } from "../commons/command-request";
import { IPlaceWordResponse } from "../commons/place-command-response.interface";
import { ICommandMessage } from "../messages/commons/command-message.interface";

import { IRoomMessage } from "../messages/commons/room-message.interface";
import { MessageHandler } from "../messages/message-handler";

export class SocketConnectionHandler {

    private _roomHandler: RoomHandler;
    private _messageHandler: MessageHandler;
    private _socket: SocketIO.Server;

    public get roomHandler(): RoomHandler {
        return this._roomHandler;
    }

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

            // let currentUsername = socket.handshake.query['username'];
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

        });
    }

    private subscribeToNewGameRequestEvent(socket: SocketIO.Socket) {

        socket.on(SocketEventType.newGameRequest,
            (connectionInfos: { username: string, gameType: number }) => {

                // console.log("new game request", socket.id);
                if (connectionInfos !== null) {
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

                        // TODO: Handle the unsubscribe to the timer after a clean debug
                        if (room.isFull()) {
                            let test = room.timerService.timer().subscribe(
                                (counter: { minutes: number, seconds: number }) => {
                                    // Send the counter value to the members of the room
                                    this._socket.to(response._roomId).emit(SocketEventType.timerEvent, counter);
                                });
                        }

                    } else {
                        console.log("Already exists");
                        // Emit only to the sender
                        socket.emit(SocketEventType.usernameAlreadyExist);
                    }
                }
                else {
                    socket.emit(SocketEventType.invalidRequest);
                }
            });
    }

    private subscribeToMessageEvent(socket: SocketIO.Socket) {

        socket.on(SocketEventType.message, (data: {
            commandType: CommandType,
            message: string
        }) => {
            let player = this._roomHandler.getPlayerBySocketId(socket.id);
            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let response = this._messageHandler.createRoomMessageResponse(player.username, room, data.message);
            this._socket.to(response._roomId).emit(SocketEventType.message, response);
        });
    }

    // A listener for an Exchange letter request
    private subscribeToExchangeLettersEvent(socket: SocketIO.Socket) {

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

            this._socket.to(room.roomId).emit(SocketEventType.commandRequest, response);
            // Emit a message with the new letters to the sender
            this._socket.to(room.roomId).emit(SocketEventType.changeLettersRequest, response);

            if (response._commandStatus === CommandStatus.Ok) {
                // Update the players queues for everyone in the room
                let playersQueues = room.getAndUpdatePlayersQueue();
                this._socket.to(room.roomId).emit(SocketEventType.updatePlayersQueue, playersQueues);
            }
        });
    }

    private subscribeToPlaceWordEvent(socket: SocketIO.Socket) {

        socket.on(SocketEventType.placeWordCommandRequest, (request: ICommandRequest<IPlaceWordResponse>) => {

            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let player = this._roomHandler.getPlayerBySocketId(socket.id);
            let response = this._messageHandler.createPlaceWordResponse(player.username, room, request._commandStatus, request._response);

            if (response._commandStatus === CommandStatus.Ok) {
                // Update the players queues for everyone in the room
                let playersQueues = room.getAndUpdatePlayersQueue();
                this._socket.to(room.roomId).emit(SocketEventType.updatePlayersQueue, playersQueues);
            }

            // Emit a message with the new letters to the sender
            this._socket.to(response._room.roomId).emit(SocketEventType.commandRequest, response);
            this._socket.to(response._room.roomId).emit(SocketEventType.placeWordCommandRequest, response);

        });
    }

    private subscribeToPassEvent(socket: SocketIO.Socket) {

        socket.on(SocketEventType.passCommandRequest, (request: {
            commandType: CommandType, commandStatus: CommandStatus, data: string
        }) => {

            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let player = this._roomHandler.getPlayerBySocketId(socket.id);
            let response = this._messageHandler
                .createCommandResponse(player.username, room, request);

            // Emit a message with the new letters to the sender
            this._socket.to(room.roomId).emit(SocketEventType.commandRequest, response);

            // Update the players queues for everyone in the room
            let playersQueues = room.getAndUpdatePlayersQueue();
            this._socket.to(room.roomId).emit(SocketEventType.updatePlayersQueue, playersQueues);

        });
    }

    private subscribeToInvalidCommandEvent(socket: SocketIO.Socket) {

        socket.on(SocketEventType.invalidCommandRequest, (request: {
            commandType: CommandType, commandStatus: CommandStatus, data: string
        }) => {

            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let player = this._roomHandler.getPlayerBySocketId(socket.id);
            let response = this._messageHandler
                .createCommandResponse(
                player.username,
                room, request);

            // Emit a message with the new letters to the sender
            this._socket.to(response._room.roomId).emit(SocketEventType.commandRequest, response);

        });
    }

    // Use to inialize the easel of the player
    private subscribeToInitializeEaselEvent(socket: SocketIO.Socket) {

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
                }
            });
    }

    // On player disconnect event
    private subscribeToDisconnectEvent(socket: SocketIO.Socket) {

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

                        // If the leaving player has the turn in the game, this state should be released, we should give the turn to the next one
                        //TODO: Check after when we will implement in the next sprint exactly what to do when a user is leaving
                        if (leavingPlayer.username === playerRoom.players.peek().username) {
                            // Update the players queue for everyone in the room
                            let playersQueues = playerRoom.getAndUpdatePlayersQueue();
                            this._socket.to(playerRoom.roomId).emit(SocketEventType.updatePlayersQueue, playersQueues);

                        }
                        // Emit a message for the other players in the room.
                        this._socket.to(playerRoom.roomId).emit(SocketEventType.leaveRoom, roomMessage);
                    }

                    console.log("player disconnected");
                }
            }
        });
    }
}
