import { CommandStatus } from "./command-status";

export interface IExchangeCommandRequest {
    _commandStatus: CommandStatus;
    _indexOfLettersToExchange: Array<number>;
}

export interface ICommandRequest<T> {
    _commandStatus: CommandStatus;
    _response: T;
}
