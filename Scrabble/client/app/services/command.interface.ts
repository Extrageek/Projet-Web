import { CommandStatus } from './commons/command-status';
import { CommandType } from './commons/command-type';
import { ICommandRequest } from './commons/command-request';

export interface ICommand {
    execute(): void;
}
