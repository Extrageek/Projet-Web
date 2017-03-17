import { CommandType } from "../command/command-type";
import { Room } from '../../../models/room';

export class IGameMessage {
    _commandType: CommandType;
    _username: string;
    _message: string;
    _date: Date;
}
