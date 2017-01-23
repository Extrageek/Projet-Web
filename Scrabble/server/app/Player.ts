import { Room } from './Room';

export class Player {
    
    private _name: String;
    private _socket: SocketIO.Socket;
    private _numberOfPlayers:number;
    private _room: Room;

    constructor(playerName: String, socket: SocketIO.Socket) {
        this._name = playerName;
        this._socket = socket;
        //socket.on("placeLetters", function(){})
        //socket.on("disconnect", function(){};
    }

    get name(): String {
        return this._name;
    }

    public enterInARoom() {

    }
}