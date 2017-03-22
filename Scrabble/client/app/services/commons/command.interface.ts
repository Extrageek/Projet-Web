import { CommandStatus } from './command-status';
import { CommandType } from './command-type';

export interface ICommand {
    execute(): void;
}
