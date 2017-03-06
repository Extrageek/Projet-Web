import { SocketService } from '../socket-service';
import { ICommand } from "./command.interface";
import { ICommandRequest } from "./commons/command-request";
import { CommandStatus } from './commons/command-status';
import { CommandType } from './commons/command-type';
import { CommandsHelper } from "./commons/commands-helper";
import { SocketEventType } from "../../commons/socket-eventType";

export class PassCommand implements ICommand {


    private _commandRequest: ICommandRequest<string>;
    private _parameters: string;

    public get commandRequest(): ICommandRequest<string> {
        return this._commandRequest;
    }
    public set commandRequest(v: ICommandRequest<string>) {
        this._commandRequest = v;
    }

    public get parameters(): string {
        return this._parameters;
    }
    public set parameters(v: string) {
        this._parameters = v;
    }

    constructor(
        private socketService: SocketService,
        params: string) {

        if (socketService === null
            || params === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }

        this.parameters = params;
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
            data: ""
        }
        this.socketService.emitMessage(SocketEventType.passCommandRequest, request);
    }
}
