import { IGameMessage } from "./game-message-interface";
import { CommandStatus } from "../command-status";

export class ICommandMessage<T> extends IGameMessage {
    _commandStatus: CommandStatus;
    _data: T;
}
