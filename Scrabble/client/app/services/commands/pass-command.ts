import { SocketService } from '../socket-service';
import { ICommand } from "./command.interface";
import { ICommandRequest } from "./commons/command-request";
import { CommandStatus } from './commons/command-status';
import { CommandType } from './commons/command-type';
import { CommandsHelper } from "./commons/commands-helper";
import { SocketEventType } from "../../commons/socket-eventType";
import { GameComponent } from "../../components/game-room.component";

export class PassCommand implements ICommand {


    private _commandRequest: ICommandRequest<string>;
    private _parameters: string;

    public get commandRequest(): ICommandRequest<string> {
        return this._commandRequest;
    }

    constructor(
        private gameComponent: GameComponent,
        params: string) {
        this.throwsErrorIfParameterIsNull(gameComponent);

        this._parameters = params;
        this._commandRequest = {
            _commandType: CommandType.PassCmd,
            _commandStatus: CommandStatus.Ok,
            _response: ""
        };
    }

    public execute() {
        let request = {
            commandType: this._commandRequest._commandType,
            commandStatus: this._commandRequest._commandStatus,
            data: this._parameters
        }
        this.gameComponent.passCurrentPlayerTurn(request);
    }

    private throwsErrorIfParameterIsNull(parameter: any) {
        if (parameter === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }
    }

}
