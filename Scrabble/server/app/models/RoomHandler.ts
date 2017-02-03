
import { Room } from "./Room";
import { Player } from "./Player";

export class RoomHandler {
    private _currentRooms: Room[];
    private _connection: SocketIO.Server;

    public constructor(connection: SocketIO.Server) {
        if (typeof(connection) === "undefined" || connection === null) {
            throw new Error("Invalid _socket server passed in parameter");
        }
        this._connection = connection;
        this._currentRooms = new Array<Room>();
    }

    get roomCount() {
        return this._currentRooms.length;
    }

    public addPlayertoARoom(player : Player): Room{
        if (player === null || typeof(player) === "undefined" || this.hasPlayerWithNameOrSocket(player)) {
            throw new Error("Invalid player passed in parameter.");
        }
        let room = this._currentRooms.find((element) => {
            return !element.roomIsFull() && element.roomCapacity === player.numberOfPlayers;
        });
        if (typeof(room) !== "undefined") {
            room.addPlayer(player);
            player.connectToARoom(room);
        }
        else {
            room = new Room(player.numberOfPlayers, this._connection, this);
            room.addPlayer(player);
            player.connectToARoom(room);
            this._currentRooms.push(room);
        }
        return room;
    }

    public hasPlayerWithNameOrSocket(player: Player): boolean {
        let roomWithPlayerName = this._currentRooms.find((element: Room): boolean => {
            return element.hasPlayerWithNameOrSocket(player);
        });
        return typeof(roomWithPlayerName) !== "undefined";
    }

    //This method is public, but can't be called from outside because it needs a Room instance as a parameter.
    //This method is reserved for the Room.
    public removeRoom(room: Room) {
        this._currentRooms = this._currentRooms.filter((element: Room) => { return element !== room; });
    }

    public areInSameRoom(player1: Player, player2: Player): boolean {
        let areInSameRoom = false;
        let room1 = this.findRoomWithPlayer(player1);
        if (typeof(room1) !== "undefined") {
            let room2 = this.findRoomWithPlayer(player2);
            if (typeof(room2) !== "undefined") {
                areInSameRoom = room1 === room2;
            }
        }
        return areInSameRoom;
    }

    private findRoomWithPlayer(player: Player): Room {
        return this._currentRooms.find((element: Room) => {
             return element.hasPlayerWithNameOrSocket(player);
        });
    }
}
