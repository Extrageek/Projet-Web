import * as http from "http";
import * as io from "socket.io";

import { RoomHandler } from "./room-handler";
import { Room } from "../models/room";
import { Player } from "../models/player";
import { Letter } from "../models/letter";

import { SocketEventType } from "./commons/socket-eventType";

import { CommandType } from "./commons/command/command-type";
import { CommandStatus } from "./commons/command/command-status";
import { ICommandRequest } from "./commons/command/command-request";
import { IPlaceWordResponse } from "./commons/command/place-word-response.interface";
import { ICommandMessage } from "./commons/message/command-message.interface";

import { IRoomMessage } from "./commons/message/room-message.interface";
import { MessageHandler } from "./message-handler";

const THREE_SECONDS = 3000;

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

                        // Subscribe to the timer in the room if the room is ready
                        if (room.isFull()) {
                            this._socket.to(response._roomId).emit(SocketEventType.updateBoard, room.board);
                            // this._socket.to(response._roomId)
                            //     .emit(SocketEventType.updateLetterInBank, room.letterBankHandler.bank.bank.length);
                            // socket.emit(SocketEventType.updateLetterInEasel, player.easel.letters.length);
                            let test = room.timerService.timer().subscribe(
                                (counter: { minutes: number, seconds: number }) => {
                                    // Send the counter value to the members of the room
                                    this._socket.to(response._roomId).emit(SocketEventType.timerEvent, counter);
                                });
                        }

                    } else {
                        // console.log("Already exists");
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

            let hasChanged = this._roomHandler.exchangeLetterOfCurrentPlayer(socket.id, request.data);
            let room = this._roomHandler.getRoomBySocketId(socket.id);
            let player = this._roomHandler.getPlayerBySocketId(socket.id);
            let response = this._messageHandler
                .createExchangeLettersResponse(
                player.username,
                room,
                request.commandStatus,
                request.data);
            response._data = request.data;
            this._socket.to(room.roomId).emit(SocketEventType.commandRequest, response);

            if (hasChanged) {
                let newEasel = room.letterBankHandler.parseFromListOfLetterToListOfString(player.easel.letters);
                // Emit a message with the new letters to the sender
                socket.emit(SocketEventType.updateEasel, newEasel);
                socket.emit(SocketEventType.updateLetterInEasel, newEasel.length);
                this._socket.to(room.roomId)
                    .emit(SocketEventType.updateLetterInBank, room.letterBankHandler.bank.numberOfLettersInBank);

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
            let response = this._messageHandler
                .createPlaceWordResponse(player.username, room, request._commandStatus, request._response);

            if (response._commandStatus === CommandStatus.Ok) {
                if (room.placeWordInTheBoard(request._response, player.username)) {
                    // Place the word in the board and emit an update board to the room members
                    this._socket.to(room.roomId).emit(SocketEventType.updateBoard, room.board);
                    // Update easel for the player
                    let newEasel = room.letterBankHandler.parseFromListOfLetterToListOfString(player.easel.letters);
                    socket.emit(SocketEventType.updateEasel, newEasel);
                    socket.emit(SocketEventType.updateLetterInEasel, newEasel.length);
                    this._socket.to(room.roomId)
                        .emit(SocketEventType.updateLetterInBank, room.letterBankHandler.bank.numberOfLettersInBank);

                    // verification
                    let isVerified = room.verifyWordsCreated(request._response, socket.id);
                    console.log("ARE WORDS VALID ---- ", isVerified);

                    if (isVerified) {
                        room.refillPlayerEasel(player.socketId);
                        newEasel = room.letterBankHandler.parseFromListOfLetterToListOfString(player.easel.letters);
                        this._socket.to(room.roomId).emit(
                            SocketEventType.updateLetterInBank,
                            room.letterBankHandler.bank.numberOfLettersInBank
                        );
                        socket.emit(SocketEventType.updateScore, player.score);
                        socket.emit(SocketEventType.updateLetterInEasel, newEasel.length);
                        socket.emit(SocketEventType.updateEasel, newEasel);
                        let playersQueues = room.getAndUpdatePlayersQueue();
                        this._socket.to(room.roomId).emit(SocketEventType.updatePlayersQueue, playersQueues);
                    }
                    // If the word doesn't respect scrabble rules, the word is removed and the board updated
                    else {
                        setTimeout(() => {
                            newEasel = room.removeLastLettersPlacedAndRefill(socket.id);
                            this._socket.to(room.roomId).emit(SocketEventType.updateBoard, room.board);
                            socket.emit(SocketEventType.updateLetterInEasel, newEasel.length);
                            socket.emit(SocketEventType.updateEasel, newEasel);
                        }, THREE_SECONDS);
                    }
                } else {
                    response._commandStatus = CommandStatus.NotAllowed;
                }
            }

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
                    let initialsLetters = room.getInitialsLetters(username);

                    // Emit a message with the new letters to the sender
                    socket.emit(SocketEventType.initializeEasel, initialsLetters);
                    socket.emit(SocketEventType.updateLetterInEasel, initialsLetters.length);
                    this._socket.to(room.roomId)
                        .emit(SocketEventType.updateLetterInBank, room.letterBankHandler.bank.numberOfLettersInBank);

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

                        // If the leaving player has the turn in the game, this state should be released,
                        // we should give the turn to the next one
                        // TODO: Check after when we will implement in the next sprint exactly what to do
                        // when a user is leaving
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
