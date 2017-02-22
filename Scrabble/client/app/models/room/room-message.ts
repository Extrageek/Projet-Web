export interface IRoomMessage {
    _username: string;
    _roomId: string;
    _numberOfMissingPlayers: number;
    _roomIsReady: boolean;
    _message: string;
    _date: Date;
}
