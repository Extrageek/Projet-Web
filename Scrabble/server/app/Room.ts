export class Room {

    private static socketRoomGeneratorId: number = 0;

    private _players: [SocketIO.Socket, String][];
    private _roomCapacity: number;
    private _socketRoomId: String;

    constructor(roomCapacity: number) {
        
        if (roomCapacity < 1 || roomCapacity > 4) {
            throw new RangeError("Invalid room capacity. Must be between 1 and 4.");
        }
        this._roomCapacity = roomCapacity;
    }

    public roomIsFull(): boolean {
        return this._players.length === this._roomCapacity;
    }

    public addPlayer(player : [SocketIO.Socket, String]) {
        if (this.roomIsFull()) {
            throw new Error("Room is already full.");
        }
        this._players.push(player);
    }

    public removePlayer(socketAssociatedToPlayer:SocketIO.Socket) {
        this._players = this._players.filter((x) => {
            return x[0].id === socketAssociatedToPlayer.id;
        })
    }


}