import { Room } from "./Room";
import { SocketCanalNames } from "./SocketCanalNames";

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
