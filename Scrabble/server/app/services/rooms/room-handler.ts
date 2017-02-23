import { Room } from "../../models/rooms/room";
import { Letter } from '../../models/lettersBank/letter';
import { Player } from "../../models/players/player";

export class RoomHandler {

    // The current rooms of the game
    _rooms: Array<Room>;

    // The constructor of the handler
    public constructor() {
        this._rooms = new Array<Room>();
    }

    // Add a new player to the related room
    public addPlayer(player: Player): Room {

        if (player === null || player === undefined) {
            throw new Error("Argument error: The player cannot be null");
        }

        try {

            if (this.getPlayerByUsername(player.username) === null) {

                // Find an available room
                let room = this.getAvailableRoom(player.numberOfPlayers);

                if (room !== null && room !== undefined) {
                    // Add the player to an existing room.
                    room.addPlayer(player);
                }
                else {
                    // Create a new room if a room is not available
                    room = new Room(player.numberOfPlayers);
                    room.addPlayer(player);
                    this._rooms.push(room);
                }

                return room;

            } else {
                return null;
            }

        } catch (error) {
            throw new Error("An error occured when adding the player into the room");
        }
    }

    // Remove a room from the list
    public removeRoom(room: Room) {
        if (room === null) {
            throw new Error("Argument error: The room cannot be null");
        }
        // Exclude the current room of the list
        this._rooms = this._rooms.filter((element: Room) => { return element !== room; });
    }

    // Find an available room with the given capacity
    public getAvailableRoom(roomCapacity: number): Room {

        if (roomCapacity < Room.roomMinCapacity || roomCapacity > Room.roomMaxCapacity) {
            throw new RangeError("Out of range error: The capacity of the room should be between 1 and 4");
        }

        let room = this._rooms.find((element) => {
            return !element.isFull() && element.roomCapacity === roomCapacity;
        });
        return (typeof (room) !== "undefined") ? room : null;
    }

    // Find a player with the given socket TODO: By username
    public getPlayerByUsername(username: string): Player {

        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }

        let currentPlayer: Player;

        // Look for a player in each room with the given socket
        this._rooms.forEach((room) => {
            currentPlayer = room.players.filter((player) => (player.username === username))[0];
        });

        return (typeof (currentPlayer) !== "undefined") ? currentPlayer : null;
    }

    // Find a room with the given username
    public getRoomByUsername(username: string): Room {

        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }

        let availableRoom: Room;

        this._rooms.forEach((room) => {
            let currentPlayer = room.players.filter((player) => (player.username === username))[0];

            if (currentPlayer !== null && currentPlayer !== undefined) {
                availableRoom = room;
            }
        });

        return (typeof (availableRoom) !== "undefined") ? availableRoom : null;
    }

    // Find the room of a player with the given socket id
    public getRoomBySocketId(socketId: string): Room {

        if (socketId === null) {
            throw new Error("Argument error: the socket id cannot be null");
        }

        let availableRoom: Room;

        this._rooms.forEach((room) => {
            let currentPlayer = room.players.filter((player) => {

                //console.log("dd", player.socketId, "-", socketId);

                return (player.socketId === socketId);
            })[0];

            if (currentPlayer !== null && currentPlayer !== undefined) {
                availableRoom = room;
            }
        });

        return (typeof (availableRoom) !== "undefined") ? availableRoom : null;
    }

    // Find a player with the given username
    public getPlayerBySocketId(socketId: string): Player {

        if (socketId === null) {
            throw new Error("Argument error: the socketId cannot be null");
        }

        let availablePlayer: Player;

        this._rooms.forEach((room) => {
            let currentPlayer = room.players.filter((player) => (player.socketId === socketId))[0];

            if (currentPlayer !== null && currentPlayer !== undefined) {
                availablePlayer = currentPlayer;
            }
        });

        return (typeof (availablePlayer) !== "undefined") ? availablePlayer : null;
    }

    public exchangeLetterOfCurrentPlayer(socketId: string, lettersToBeExchange: Array<string>): Array<string> {
        let letters = new Array<string>();
        if (socketId === null) {
            throw new Error("The socket value cannot be null.");
        }
        if (lettersToBeExchange === null) {
            throw new Error("The list of letters to be exchanged cannot cannot be null.");
        }
        let playerRoom = this.getRoomBySocketId(socketId);

        if (playerRoom !== null) {
            letters = playerRoom.exchangeThePlayerLetters(lettersToBeExchange);
        }
        return letters;
    }
}
