import { SocketCanalNames } from "./SocketCanalNames";

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

export class Player {
    private _name: string;
    private _socket: SocketIO.Socket;
    private _numberOfPlayers: number;
    private _room: Room;

    constructor(playerName: string, numberOfPlayers: number, socket: SocketIO.Socket) {
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

    get name(): string {
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

    private static socketRoomGeneratorId: number = 0;

    private _players: Player[];
    private _roomCapacity: number;
    private _roomHandler: RoomHandler;
    private _socketRoomId: string;
    private _connection: SocketIO.Server;

    constructor(roomCapacity: number, connection: SocketIO.Server, roomHandler: RoomHandler) {
        if (roomCapacity < 1 || roomCapacity > 4) {
            throw new RangeError("Invalid room capacity. Must be between 1 and 4.");
        }
        this._roomCapacity = roomCapacity;
        this._players = new Array<Player>();
        this._roomHandler = roomHandler;
        this._socketRoomId = String(Room.socketRoomGeneratorId);
        this._connection = connection;
        ++Room.socketRoomGeneratorId;
    }

    get roomCapacity(): number {
        return this._roomCapacity;
    }

    get numberOfMissingPlayers(): number {
        return this._roomCapacity - this._players.length;
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
        player.socket.join(this._socketRoomId);
        this._connection.to(this._socketRoomId).emit(SocketCanalNames.PLAYERS_MISSING, this.numberOfMissingPlayers);
    }

    public removePlayer(player: Player) {

        let index = this._players.findIndex((element) => {
            return (element === player);
        });
        if (index !== -1) {
            let playerRemoved = this._players.splice(index, 1);
            playerRemoved[0].socket.leave(this._socketRoomId);
            if (this._players.length === 0) {
                this._roomHandler.removeRoom(this);
            }
            else {
                this._connection.to(this._socketRoomId).emit(
                    SocketCanalNames.PLAYERS_MISSING, this.numberOfMissingPlayers);
            }
        }
    }

    public hasPlayerWithNameOrSocket(player: Player): boolean {
        let playerWithSameName = this._players.find((element: Player) => {
            return element.name === player.name || element.socket === player.socket;
        });
        return typeof(playerWithSameName) !== "undefined";
    }
}
