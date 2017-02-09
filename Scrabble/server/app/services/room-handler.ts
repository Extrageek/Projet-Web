
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

        let availableRoom = this.findAvailableRoom(player.numberOfPlayers);

        //console.log("player is not null, available room", playerRoom);
        if (availableRoom === null) {

            // Create a new room if a room is not available
            availableRoom = new Room(player.numberOfPlayers);

            // Add the new player
            if (!availableRoom.addPlayer(player)) {
                return null;
            }

            //console.log("in new room", playerRoom);
            this._rooms.push(availableRoom);
        }
        else {
            // Add the player to an existing room.
            availableRoom.addPlayer(player);
        }

        return availableRoom;
    }

    // Remove a room from the list
    public removeRoom(room: Room) {
        // Exclude the current room of the list
        this._rooms = this._rooms.filter((element: Room) => { return element !== room; });
    }

    // Find an available room with the given capacity
    public findAvailableRoom(roomCapacity: number): Room {

        let room = this._rooms.find((element) => {
            return !element.roomIsFull() && element.roomCapacity === roomCapacity;
        });

        if (typeof (room) !== "undefined") {
            return room;
        }

        return null;
    }

    // Find a player with the given socket TODO: By username
    public findPlayerByUsername(username: string): Player {

        if (username === null) {
            throw new Error("Null argument error");
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
    public findRoomByUsername(username: string): Room {

        if (username === null) {
            throw new Error("Null argument error");
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
