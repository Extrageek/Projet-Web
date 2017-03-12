import { IGameMessage } from "./game-message.interface";
import { CommandStatus } from "../../commons/command-status";
import { Room } from "../../../models/rooms/room";

export class ICommandMessage<T> extends IGameMessage {
    _commandStatus: CommandStatus;
    _room: Room;
    _data: T;
}
