import { Injectable } from "@angular/core";
import { SocketService } from './socket-service';

import { EaselComponent } from "../components/easel.component";
import { BoardComponent } from "../components/board.component";
import { ChatroomComponent } from "../components/chatroom.component";
import { GameComponent } from "../components/game-room.component";

import { EaselManagerService } from "./easel-manager.service";
// import { LetterHelper } from "../commons/letter-helper";
import { IScrabbleLetter } from "../models/scrabble-letter";

import { CommandType } from "./commons/command-type";
import { CommandStatus } from "./commons/command-status";
import { ICommandRequest } from "./commons/command-request";
import { CommandsHelper } from "./commons/commands-helper";

import { MessageCommand } from './message-command';
import { ChangeLettersCommand } from './change-letters-command';
import { PlaceWordCommand } from './place-word-command';
import { PassCommand } from './pass-command';

const PARAM_INDEX = 1;

@Injectable()
export class CommandsService {

    constructor(private easelManagerService: EaselManagerService) { }

    public invokeAndExecuteMessageCommand(
        receiverChatRoom: ChatroomComponent,
        params: string) {

        if (receiverChatRoom === null
            || params === null
            || params === "") {
            throw new Error("Null argument error: the parameters cannot be null");
        }

        let messageCommand = new MessageCommand(receiverChatRoom, params);
        messageCommand.execute();
    }

    public invokeAndExecuteExchangeCommand(
        receiverEaselCompoment: EaselComponent,
        params: string) {

        if (receiverEaselCompoment === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }

        let changeCommand = new ChangeLettersCommand(receiverEaselCompoment, params);
        changeCommand.execute();
    }

    public invokeAndExecutePlaceCommand(
        receiverEaselCompoment: EaselComponent,
        receiverBoardComponent: BoardComponent,
        params: string) {


        if (receiverEaselCompoment === null
            || receiverBoardComponent === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }

        let placeWordCommand = new PlaceWordCommand(
            receiverEaselCompoment,
            receiverBoardComponent,
            params);

        placeWordCommand.execute();
    }

    public invokeAndExecutePassCommand(receiverGameComponent: GameComponent) {

        if (receiverGameComponent === null
            || receiverGameComponent === undefined) {
            throw new Error("Null argument error: the parameters cannot be null");
        }

        let passCommand = new PassCommand(receiverGameComponent);
        passCommand.execute();
    }

    public extractCommandParameters(enteredValue: string): { commandType: CommandType, parameters: string } {
        this.throwsErrorIfParameterIsNull(enteredValue);
        let texte = enteredValue.trim();
        let request = { commandType: CommandType.Unknown, parameters: "" };

        if (texte.startsWith(CommandsHelper.PLACE_COMMAND)) {
            request.commandType = CommandType.PlaceCmd;
            request.parameters = texte.split(CommandsHelper.PLACE_COMMAND)[PARAM_INDEX].trim();

        } else if (texte.startsWith(CommandsHelper.EXCHANGE_COMMAND)) {
            request.commandType = CommandType.ExchangeCmd;
            request.parameters = texte.split(CommandsHelper.EXCHANGE_COMMAND)[PARAM_INDEX].trim();

        } else if (texte.startsWith(CommandsHelper.PASS_COMMAND)) {
            request.commandType = CommandType.PassCmd;
            request.parameters = texte.split(CommandsHelper.PASS_COMMAND)[PARAM_INDEX].trim();

        } else if (texte.startsWith(CommandsHelper.GUIDE)) {
            request.commandType = CommandType.Guide;
            request.parameters = texte.split(CommandsHelper.GUIDE)[PARAM_INDEX].trim();

        } else if (texte.startsWith('!') && !texte.startsWith(CommandsHelper.PLACE_COMMAND)) {
            request.commandType = CommandType.InvalidCmd;
            request.parameters = texte.trim();

        } else if (texte !== null && texte !== "") {
            request.commandType = CommandType.MessageCmd;
            request.parameters = texte.trim();
        }

        return request;
    }

    private throwsErrorIfParameterIsNull(parameter: any) {
        if (parameter === null) {
            throw new Error("Null argument error: the letter entered cannot be null");
        }
    }
}
