import { Player } from "./Player";

export class Room {

    //private static socketRoomGeneratorId: number = 0;

    private _players: Player[];
    private _roomCapacity: number;
    //private _socketRoomId: String;

    constructor(roomCapacity: number) {
        if (roomCapacity < 1 || roomCapacity > 4) {
            throw new RangeError("Invalid room capacity. Must be between 1 and 4.");
        }
        this._roomCapacity = roomCapacity;
        this._players = new Array<Player>();
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
    }

    public hasPlayerWithName(name: String): boolean {
        let playerWithSameName = this._players.find((element: Player) => { return element.name === name; });
        return typeof(playerWithSameName) !== "undefined";
    }
}
