import { IGameMessage } from "./game-message.interface";
import { CommandType } from "../../services/commons/command-type";
import { CommandStatus } from "../../services/commons/command-status";

export interface ICommandMessage<T> extends IGameMessage {
    _commandStatus: CommandStatus;
    _data: T;
}
