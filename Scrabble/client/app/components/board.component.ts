import { Component, OnInit } from "@angular/core";
import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { Square } from '../models/square/square';
import { Board } from '../models/board/board';
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { CommandType } from "../services/commands/commons/command-type";
import { CommandStatus } from "../services/commands/commons/command-status";
import { ICommandRequest } from '../services/commands/commons/command-request';
import { ICommandMessage } from "../commons/messages/command-message.interface";

import { Subscription } from "rxjs/Subscription";

@Component({
    moduleId: module.id,
    selector: "scrabble-main-board-selector",
    templateUrl: "../../assets/templates/scrabble.html",
    styleUrls: ["../../assets/stylesheets/scrabble-board.css"]
})

export class BoardComponent implements OnInit {
    private _scrabbleGrid: Board;
    private _placeWordEventSubcription: Subscription;
    public get scrabbleGrid(): Board {
        return this._scrabbleGrid;
    }

    constructor(private socketService: SocketService) {
        this._scrabbleGrid = new Board();
    }

    ngOnInit() {
        this.onPlaceWordCommand();
    }

    private onPlaceWordCommand(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.placeWordCommandRequest)
            .subscribe((response: ICommandMessage<Array<Array<string>>>) => {
                if (response !== undefined) {
                    // TODO: To be completed
                    console.log("Place Word response from the server ", response);
                }
            });
    }

    placeWordInBoard(commandRequest: ICommandRequest<Array<ScrabbleLetter>>) {

        let outputRequest = {
            commandType: CommandType.PlaceCmd,
            commandStatus: commandRequest._commandStatus,
            data: new Array<string>()
        };

        commandRequest._response.forEach((letter) => {
            outputRequest.data.push(letter.letter);
        });

        if (commandRequest._commandStatus === CommandStatus.Ok) {
            // TODO: Place the word from here in the board if everything is ok
        }
        this.socketService.emitMessage(SocketEventType.placeWordCommandRequest, outputRequest);
    }
}
