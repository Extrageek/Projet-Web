import { CommandType } from "../../services/commands/commons/command-type";

export interface IGameMessage {
    _commandType: CommandType;
    _username: string;
    _message: string;
    _date: Date;
}
