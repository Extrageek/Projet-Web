import { Room } from "./Room";
import { RoomHandler } from "./RoomHandler";

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

    public connectToARoom(): Room {
        if (this._room === null) {
            this._room = RoomHandler.addPlayertoARoom(this);
            let room = this._room;
            this._socket.on("disconnect", () => {
                room.removePlayer(this);
                room = null;
            });
        }
        return this._room;
    }

    public leaveRoom() {
        if (this._room !== null) {
            this._room.removePlayer(this);
            this._room = null;
        }
    }
}
