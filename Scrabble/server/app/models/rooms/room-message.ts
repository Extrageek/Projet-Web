export class RoomMessage {

    private _username: string;
    private _roomId: string;
    private _numberOfMissingPlayers: number;
    private _roomIsReady: boolean;
    private _message: string;

    public get username(): string {
        return this._username;
    }
    public set username(v: string) {
        this._username = v;
    }

    public get roomId(): string {
        return this._roomId;
    }
    public set roomId(v: string) {
        this._roomId = v;
    }

    public get numberOfMissingPlayers(): number {
        return this._numberOfMissingPlayers;
    }
    public set numberOfMissingPlayers(v: number) {
        this._numberOfMissingPlayers = v;
    }

    public get roomIsReady(): boolean {
        return this._roomIsReady;
    }
    public set roomIsReady(v: boolean) {
        this._roomIsReady = v;
    }

    public get message(): string {
        return this._message;
    }
    public set message(v: string) {
        this._message = v;
    }

    constructor(username: string, roomId: string, numberOfMissingPlayers: number, roomIsReady: boolean, message: string) {
        if (username === null
            || roomId === null
            || numberOfMissingPlayers === null
            || message === null) {
            throw new Error("Null argument error, some required parameters are missing");
        }

        this._username = username;
        this._roomId = roomId;
        this._numberOfMissingPlayers = numberOfMissingPlayers;
        this._roomIsReady = roomIsReady;
        this._message = message;
    }

}