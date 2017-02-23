import { CommandType } from '../../services/commands/command-type';

export class IGameMessage {
    _username: string;
    _message: string;
    _date: Date;
    _commandType: CommandType;
}
