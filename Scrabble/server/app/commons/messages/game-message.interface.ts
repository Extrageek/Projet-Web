import { CommandType } from "../command-type";

export class IGameMessage {
    _commandType: CommandType;
    _username: string;
    _message: string;
    _date: Date;
    _roomId: string;
}
