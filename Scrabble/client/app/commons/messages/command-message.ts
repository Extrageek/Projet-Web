import { IGameMessage } from './game-message-interface';
import { CommandType } from '../../services/commands/command-type';

export interface ICommandMessage<T> extends IGameMessage {
    _data: T;
}