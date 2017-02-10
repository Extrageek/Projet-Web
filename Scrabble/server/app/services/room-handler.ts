
import { Room } from "../models/room";
import { Player } from "../models/player";

export class RoomHandler {

    // The current rooms of the game
    private _rooms: Array<Room>;

    // The constructor of the handler
    public constructor() {
        this._rooms = new Array<Room>();
    }

    // Add a new player to the related room
    public addPlayer(player: Player): Room {

        if (player === null) {
            throw new Error("Argument error: The player cannot be null");
        }

        try {

            let room = this.getAvailableRoom(player.numberOfPlayers);

            //console.log("player is not null, available room", playerRoom);
            if (room === null) {

                // Create a new room if a room is not available
                room = new Room(player.numberOfPlayers);

                // Add the new player
                room.addPlayer(player);

                //console.log("in new room", playerRoom);
                this._rooms.push(room);
            }
            else {
                // Add the player to an existing room.
                room.addPlayer(player);
            }

            return room;

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

        if (roomCapacity < 0 && roomCapacity > 4) {
            throw new Error("Out of range error: The room capacity must be between 1 and 4");
        }
        let room = this._rooms.find((element) => {
            return !element.isFull() && element.roomCapacity === roomCapacity;
        });

        if (typeof (room) !== "undefined") {
            return room;
        }

        return null;
    }

    // Find a player with the given socket TODO: By username
    public getPlayerByUsername(username: string): Player {

        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }

        // Look for a player in each room with the given socket
        this._rooms.forEach((room) => {
            let currentPlayer = room.players.find((player) => (player.username === username));

            if (currentPlayer !== null) {
                return currentPlayer;
            }
        });

        return null;
    }

    // Find a room with the givent socket TODO: By username
    public getRoomByUsername(username: string): Room {

        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }

        // Look for a room with a player that have the given socket
        this._rooms.forEach((room) => {
            let currentPlayer = room.players.filter((player) => (player.username === username))[0];
            if (currentPlayer !== null) {
                return room;
            }
        });

        return null;
    }
}
