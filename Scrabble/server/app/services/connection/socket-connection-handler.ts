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

                this.subscribeToNewGameEvent(socket);
                this.onInitializeEasel(socket);
                this.subscribeToMessageEvent(socket);
                this.subscribeToExchangeLettersEvent(socket);
                this.subscribeToCommandEvent(socket);
                this.onDisconnect(socket);

            } catch (error) {
                this._socket.emit(SocketEventType.connectError);
            }
        });
    }

    private subscribeToMessageEvent(socket: SocketIO.Socket) {
        socket.on(SocketEventType.message, (data: {
            commandType: CommandType, username: string, message: string
        }) => {
            let response = this.createRoomMessageResponse(data);
            this._socket.to(response._roomId).emit(SocketEventType.message, response);
        });
    }

    // A listener for an Exchange letter request
    private subscribeToExchangeLettersEvent(socket: SocketIO.Socket) {
        socket.on(SocketEventType.changeLettersRequest, (data: {
            commandType: CommandType,
            listOfLettersToChange: Array<string>
        }) => {
            let response = this.createExchangeLettersResponse(socket.id, data);
            if (response !== null) {
                // Emit a message with the new letters to the sender
                this._socket.to(response._roomId).emit(SocketEventType.changeLettersRequest, response);

            } else {
                socket.emit(SocketEventType.invalidRequest);
            }
        });
    }

    private subscribeToCommandEvent(socket: SocketIO.Socket) {
        socket.on(SocketEventType.commandRequest,
            (data: { commandType: CommandType, commandStatus: CommandStatus, data: string }) => {
                let response = this.createCommandResponse(socket.id, data);

                if (response !== null) {
                    // Emit a message with the new letters to the sender
                    this._socket.to(response._roomId).emit(SocketEventType.commandRequest, response);
                } else {

                }
            });
    }
    // En event when a player ask for a new game
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

                // Check if the username is already taken or not
                if (this._roomHandler.getPlayerByUsername(connectionInfos.username) === null) {

                    // Create a new player and return his new room.
                    let player = new Player(connectionInfos.username, connectionInfos.gameType, socket.id);

                    console.log(player);
                    let room = this._roomHandler.addPlayer(player);

                    // Join the room
                    socket.join(room.roomId);
                    this.subscribeToJoinedRoomMessage(player.username, room, socket);

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
    private subscribeToJoinedRoomMessage(username: string, room: Room, socket: SocketIO.Socket) {

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
    private createRoomMessageResponse(roomMessage: { commandType: CommandType, username: string, message: string }): IRoomMessage {

        if (roomMessage === null) {
            throw new Error("The socket value cannot be null.");
        }

        let currentRoom = this._roomHandler.getRoomByUsername(roomMessage.username);
        if (currentRoom == null || currentRoom === undefined) {
            // TODO: Maybe emit an error to the sender
            throw new Error("Error, we should not be here, never, ever");
        }

        // Create a response for the room members
        let response: IRoomMessage = {
            _username: roomMessage.username,
            _roomId: currentRoom.roomId,
            _numberOfMissingPlayers: currentRoom.numberOfMissingPlayers(),
            _roomIsReady: currentRoom.isFull(),
            _message: roomMessage.message,
            _date: new Date(),
            _commandType: roomMessage.commandType
        };

        return response;
    }

    // Use to exchange the letters of a player
    private createExchangeLettersResponse(socketId: string, data: {
        commandType: CommandType,
        listOfLettersToChange: Array<string>
    }): ICommandMessage<Array<string>> {

        if (socketId === null || data.listOfLettersToChange === null) {
            throw new Error("Null argument exception: the parameter cannot be null be null.");
        }

        let changedLetters = this._roomHandler
            .exchangeLetterOfCurrentPlayer(socketId, data.listOfLettersToChange);
        let commandMessage: ICommandMessage<Array<string>>;
        let playerRoom = this._roomHandler.getRoomBySocketId(socketId);

        if (playerRoom === null
            && changedLetters === null
            && changedLetters.length !== data.listOfLettersToChange.length) {
            commandMessage = null;

        } else {
            let player = this._roomHandler.getPlayerBySocketId(socketId);
            //let newPlayersOrder = playerRoom.getAndUpdatePlayersOrder();
            //let newPlayersOrder =playerRoom;
            // console.log("newOrder", newPlayersOrder);

            let message = `$: <!changer` + ' ' + `${data.listOfLettersToChange.toString()}>`;

            commandMessage = {
                _commandType: data.commandType,
                _commandStatus: CommandStatus.Ok,
                _username: player.username,
                _message: message,
                _data: changedLetters,
                _roomId: playerRoom.roomId,
                _date: new Date()
            };
        }

        return commandMessage;
    }

    private createCommandResponse(socketId: string, data: {
        commandType: CommandType, commandStatus: CommandStatus, data: string
    }): ICommandMessage<string> {
        if (socketId === null) {
            throw new Error("The socket value cannot be null.");
        }

        let playerRoom = this._roomHandler.getRoomBySocketId(socketId);
        let player = this._roomHandler.getPlayerBySocketId(socketId);
        let message = `$: ${CommandStatus[data.commandStatus]}` + ': ' + `<${data.data}>`;
        let commandMessage: ICommandMessage<string>;

        if (playerRoom === null || player === null) {
            commandMessage = null;
        } else {
            commandMessage = {
                _commandType: data.commandType,
                _commandStatus: data.commandStatus,
                _username: player.username,
                _message: message,
                _data: null,
                _roomId: playerRoom.roomId,
                _date: new Date(),
            };
        }

        console
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
