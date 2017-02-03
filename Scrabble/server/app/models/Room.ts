import { Player } from "./Player";
import { RoomHandler } from "./RoomHandler";
import { SocketCanalNames } from "./SocketCanalNames";

export class Room {

    private static socketRoomGeneratorId = 0;

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
