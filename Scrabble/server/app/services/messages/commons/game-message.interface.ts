import { CommandType } from "../../commons/command-type";
import { Room } from '../../../models/rooms/room';

export class IGameMessage {
    _commandType: CommandType;
    _username: string;
    _message: string;
    _date: Date;
}
