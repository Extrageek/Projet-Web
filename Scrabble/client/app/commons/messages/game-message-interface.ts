import { CommandType } from "../../services/commands/command-type";

export interface IGameMessage {
    _username: string;
    _message: string;
    _date: Date;
    _commandType: CommandType;
}
