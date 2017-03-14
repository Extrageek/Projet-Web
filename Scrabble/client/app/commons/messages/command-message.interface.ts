import { IGameMessage } from "./game-message.interface";
import { CommandType } from "../../services/commands/commons/command-type";
import { CommandStatus } from "../../services/commands/commons/command-status";

export interface ICommandMessage<T> extends IGameMessage {
    _commandStatus: CommandStatus;
    _data: T;
}
