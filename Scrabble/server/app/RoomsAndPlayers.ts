import { SocketCanalNames } from "./SocketCanalNames";

export class RoomHandler {
    private _currentRooms: Room[];

    public constructor() {
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
            room = new Room(player.numberOfPlayers, this);
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

export class Player {
    private _name: String;
    private _socket: SocketIO.Socket;
    private _numberOfPlayers: number;
    private _room: Room;

    constructor(playerName: String, numberOfPlayers: number, socket: SocketIO.Socket) {
        if (playerName === null) {
            throw new Error("Invalid parameters.");
        }
        let playerNameTrimed = playerName.trim();
        if (playerNameTrimed === "" || numberOfPlayers < 1 || numberOfPlayers > 4 || socket === null) {
            throw new Error("Invalid parameters.");
        }
        this._name = playerName;
        this._numberOfPlayers = numberOfPlayers;
        this._socket = socket;
        this._room = null;
    }

    get name(): String {
        return this._name;
    }

    get numberOfPlayers(): number {
        return this._numberOfPlayers;
    }

    get socket(): SocketIO.Socket {
        return this._socket;
    }

    //This method is public, but can't be called from outside because it needs a Room instance as a parameter.
    //This method is reserved for the RoomHandler.
    public connectToARoom(roomToConnect: Room) {
        if (this._room === null && roomToConnect !== null && typeof(roomToConnect) !== "undefined") {
            this._room = roomToConnect;
            let room = this._room;
            this._socket.on(SocketCanalNames.DISCONNECTION, () => {
                room.removePlayer(this);
                room = null;
            });
        }
    }

    public leaveRoom() {
        if (this._room !== null) {
            this._room.removePlayer(this);
            this._room = null;
        }
    }
}

class Room {

    //private static socketRoomGeneratorId: number = 0;

    private _players: Player[];
    private _roomCapacity: number;
    private _roomHandler: RoomHandler;
    //private _socketRoomId: String;

    constructor(roomCapacity: number, roomHandler: RoomHandler) {
        if (roomCapacity < 1 || roomCapacity > 4) {
            throw new RangeError("Invalid room capacity. Must be between 1 and 4.");
        }
        this._roomCapacity = roomCapacity;
        this._players = new Array<Player>();
        this._roomHandler = roomHandler;
    }

    get roomCapacity(): number {
        return this._roomCapacity;
    }

    public roomIsFull(): boolean {
        return this._players.length === this._roomCapacity;
    }

    public addPlayer(player: Player) {
        if (this.roomIsFull()) {
            throw new Error("Room is already full.");
        }
        if (typeof(player) === "undefined" || player == null) {
            throw new Error("The player is undefined");
        }
        this._players.push(player);
    }

    public removePlayer(player: Player) {
        this._players = this._players.filter((element) => {
            return element !== player;
        });
        if (this._players.length === 0) {
            this._roomHandler.removeRoom(this);
        }
    }

    public hasPlayerWithNameOrSocket(player: Player): boolean {
        let playerWithSameName = this._players.find((element: Player) => {
            return element.name === player.name || element.socket === player.socket;
        });
        return typeof(playerWithSameName) !== "undefined";
    }
}
