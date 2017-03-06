import * as http from "http";
import * as io from "socket.io";

import { RoomHandler } from "../../services/rooms/room-handler";
import { Room } from "../../models/rooms/room";
import { Player } from "../../models/players/Player";
import { Letter } from "../../models/lettersBank/letter";

import { SocketEventType } from "../../commons/socket-eventType";
import { CommandType } from "../../commons/command-type";
import { CommandStatus } from "../../commons/command-status";
import { IRoomMessage } from "../../commons/messages/room-message.interface";
import { ICommandMessage } from "../../commons/messages/command-message.interface";

export class SocketConnectionHandler {

    private _roomHandler: RoomHandler;
    private _socket: SocketIO.Server;

    constructor(server: http.Server) {

        if (server === null || typeof (server) === "undefined") {
            throw new Error("Invalid server parameter.");
        }

        this._roomHandler = new RoomHandler();
        this._socket = io.listen(server);
        this.initializeListeners();
    }

    private initializeListeners() {
        this._socket.sockets.on(SocketEventType.connection, (socket: SocketIO.Socket) => {
            console.log("a new connection to the server", socket.id);

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

                this.subscribeToNewGameEvent(socket);
                this.onInitializeEasel(socket);
                this.subscribeToMessageEvent(socket);
                this.subscribeToExchangeLettersEvent(socket);
                this.subscribeToPlaceWordEvent(socket);
                this.subscribeToPassEvent(socket);
                this.subscribeToInvalidCommandEvent(socket);
                this.onDisconnect(socket);

            } catch (error) {
                this._socket.emit(SocketEventType.connectError);
            }
        });
    }

    private subscribeToNewGameEvent(socket: SocketIO.Socket) {
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
                let response = this.createJoinedRoomMessage(socket.id, connectionInfos);
                if (response !== null) {
                    // Join the room
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
            let response = this.createRoomMessageResponse(player.username, data.commandType, data.message);
            if (data.commandType === CommandType.MessageCmd) {
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
        socket.on(SocketEventType.changeLettersRequest, (data: {
            commandType: CommandType,
            commandStatus: CommandStatus
            data: Array<string>
        }) => {
            let response = this.createExchangeLettersResponse(socket.id, data);
            if (response !== null) {
                this._socket.to(response._roomId).emit(SocketEventType.commandRequest, response);
                // Emit a message with the new letters to the sender
                this._socket.to(response._roomId).emit(SocketEventType.changeLettersRequest, response);

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
            commandType: CommandType, commandStatus: CommandStatus, listOfLettersToPlace: Array<string>
        }) => {
            let response = this.createPlaceWordResponse(socket.id, data);

            if (response !== null) {
                // Emit a message with the new letters to the sender
                this._socket.to(response._roomId).emit(SocketEventType.commandRequest, response);
                this._socket.to(response._roomId).emit(SocketEventType.placeWordCommandRequest, response);
            } else {
                // TODO:
            }
        });
    }

    private subscribeToPassEvent(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }
        socket.on(SocketEventType.passCommandRequest, (data: {
            commandType: CommandType, commandStatus: CommandStatus, data: string
        }) => {

            let response = this.createCommandResponse(socket.id, data);
            if (response !== null) {
                // Emit a message with the new letters to the sender
                this._socket.to(response._roomId).emit(SocketEventType.commandRequest, response);
            } else {
                // TODO:
            }
        });
    }

    private subscribeToInvalidCommandEvent(socket: SocketIO.Socket) {
        if (socket === null) {
            throw new Error("The socket value cannot be null.");
        }
        socket.on(SocketEventType.invalidCommandRequest, (data: {
            commandType: CommandType, commandStatus: CommandStatus, data: string
        }) => {

            let response = this.createCommandResponse(socket.id, data);
            if (response !== null) {
                // Emit a message with the new letters to the sender
                this._socket.to(response._roomId).emit(SocketEventType.commandRequest, response);
            } else {
                // TODO:
            }
        });
    }

    // En event when a player ask for a new game
    private createJoinedRoomMessage(
        socketId: string,
        connectionInfos: {
            username: string,
            gameType: number
        }) {
        if (connectionInfos === null) {
            throw new Error("The socket value cannot be null.");
        }

        let response: IRoomMessage;

        // Check if the username is already taken or not
        if (this._roomHandler.getPlayerByUsername(connectionInfos.username) === null) {
            // Create a new player and return his new room.
            let player = new Player(connectionInfos.username, connectionInfos.gameType, socketId);

            console.log(player);
            let room = this._roomHandler.addPlayer(player);
            let message = `${player.username}` + ` joined the room`;
            response = this.createRoomMessageResponse(player.username, CommandType.MessageCmd, message);
        }
        else {
            response = null;
        }

        return response;
    }

    // Handle a message sent by a member of a room
    private createRoomMessageResponse(
        username: string,
        commandType: CommandType,
        message: string): IRoomMessage {

        if (username === null
            || commandType == null) {
            throw new Error("The message cannot be null.");
        }
        let currentRoom = this._roomHandler.getRoomByUsername(username);
        if (currentRoom == null || currentRoom === undefined) {
            // TODO: Maybe emit an error to the sender
            throw new Error("Error, we should not be here, never, ever");
        }

        // Create a response for the room members
        let response: IRoomMessage = {
            _username: username,
            _roomId: currentRoom.roomId,
            _numberOfMissingPlayers: currentRoom.numberOfMissingPlayers(),
            _roomIsReady: currentRoom.isFull(),
            _message: message,
            _date: new Date(),
            _commandType: commandType
        };

        return response;
    }

    // Use to exchange the letters of a player
    private createExchangeLettersResponse(
        socketId: string,
        request: {
            commandType: CommandType,
            commandStatus: CommandStatus
            data: Array<string>
        }): ICommandMessage<Array<Array<string>>> {

        if (socketId === null || request.data === null) {
            throw new Error("Null argument exception: the parameter cannot be null be null.");
        }

        let changedLetters = this._roomHandler
            .exchangeLetterOfCurrentPlayer(socketId, request.data);
        let exchangeCommandResponse: ICommandMessage<Array<Array<string>>>;
        let playerRoom = this._roomHandler.getRoomBySocketId(socketId);

        if (playerRoom === null
            && changedLetters === null
            && changedLetters.length !== request.data.length) {
            exchangeCommandResponse = null;

        } else {
            let player = this._roomHandler.getPlayerBySocketId(socketId);
            let playersStatus = playerRoom.getAndUpdatePlayersOrder();
            let message: string;

            if (request.commandStatus == CommandStatus.Ok) {
                message = `$: <!changer> ` + ' ' + `${request.data.toString()}`;

            } else {
                message = `$: ${CommandStatus[request.commandStatus]} `
                    + `<!changer> ` + ' '
                    + `${request.data.toString()}`;
            }

            exchangeCommandResponse = {
                _commandType: request.commandType,
                _commandStatus: request.commandStatus,
                _username: player.username,
                _message: message,
                _data: [changedLetters, playersStatus],
                _roomId: playerRoom.roomId,
                _date: new Date()
            };
        }

        return exchangeCommandResponse;
    }

    // Use to exchange the letters of a player
    private createPlaceWordResponse(
        socketId: string,
        request: {
            commandType: CommandType,
            commandStatus: CommandStatus
            data: Array<string>
        }): ICommandMessage<Array<Array<string>>> {

        if (socketId === null || request.data === null) {
            throw new Error("Null argument exception: the parameter cannot be null be null.");
        }

        // TODO: To be completed
        let commandMessage: ICommandMessage<Array<Array<string>>>;
        let playerRoom = this._roomHandler.getRoomBySocketId(socketId);

        if (playerRoom === null) {
            commandMessage = null;

        } else {
            let player = this._roomHandler.getPlayerBySocketId(socketId);
            let playersStatus = playerRoom.getAndUpdatePlayersOrder();
            let message: string;

            if (request.commandStatus == CommandStatus.Ok) {
                message = `$: <!placer> ` + ' ' + `${request.data.toString()}`;

            } else {
                message = `$: ${CommandStatus[request.commandStatus]} `
                    + `<!placer> ` + ' ' + `${request.data.toString()}`;
            }

            commandMessage = {
                _commandType: request.commandType,
                _commandStatus: request.commandStatus,
                _username: player.username,
                _message: message,
                _data: [request.data, playersStatus],
                _roomId: playerRoom.roomId,
                _date: new Date()
            };
        }

        return commandMessage;
    }

    private createCommandResponse(
        socketId: string,
        request: {
            commandType: CommandType,
            commandStatus: CommandStatus,
            data: string
        }): ICommandMessage<Array<Array<string>>> {
        if (socketId === null) {
            throw new Error("The socket value cannot be null.");
        }
        console.log

        let playerRoom = this._roomHandler.getRoomBySocketId(socketId);
        let player = this._roomHandler.getPlayerBySocketId(socketId);
        let message: string;

        if (request.commandStatus == CommandStatus.Ok) {
            message = `$: <!${CommandType[request.commandType]}>` + ' '
                + `${request.data}`;

        } else {
            message = `$: ${CommandStatus[request.commandStatus]} ` + ' '
                + `<${request.data}>`;
        }

        let commandMessage: ICommandMessage<Array<Array<string>>>;
        let playersStatus = playerRoom.getAndUpdatePlayersOrder();

        if (playerRoom === null || player === null) {
            commandMessage = null;
        } else {
            commandMessage = {
                _commandType: request.commandType,
                _commandStatus: request.commandStatus,
                _username: player.username,
                _message: message,
                _data: [null, playersStatus],
                _roomId: playerRoom.roomId,
                _date: new Date(),
            };
        }

        return commandMessage;
    }

    // Use to inialize the easel of the player
    private onInitializeEasel(socket: SocketIO.Socket) {

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

                } else {
                    throw new Error("An error occured when trying to exchange the letters");
                }
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
