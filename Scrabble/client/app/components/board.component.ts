import { Component, OnInit } from "@angular/core";

import { ScrabbleLetter } from "../models/letter/scrabble-letter";
import { Square } from '../models/square/square';
import { SquarePosition } from '../models/square/square-position';
import { Board } from '../models/board/board';

import { SocketEventType } from "../commons/socket-eventType";
import { SocketService } from "../services/socket-service";
import { BoardManagerService } from "../services/board-manager.service";
import { ExceptionHelperService } from "../services/helpers/exception-helper.service";

import { IPlaceWordResponse } from "../services/commands/commandPlaceWord/place-command-response.interface";
import { CommandType } from "../services/commands/commons/command-type";
import { CommandStatus } from "../services/commands/commons/command-status";
import { ICommandRequest } from '../services/commands/commons/command-request';
import { ICommandMessage } from "../commons/messages/command-message.interface";

import { Subscription } from "rxjs/Subscription";

@Component({
    moduleId: module.id,
    selector: "scrabble-main-board-selector",
    templateUrl: "../../assets/templates/scrabble.html",
    styleUrls: ["../../assets/stylesheets/scrabble-board.css"],
    providers: [BoardManagerService, ExceptionHelperService]
})

export class BoardComponent implements OnInit {
    board: Board;
    private _placeWordEventSubcription: Subscription;
    public get scrabbleGrid(): Board {
        return this.board;
    }

    constructor(
        private socketService: SocketService,
        private boardManagerService: BoardManagerService) {
        this.board = new Board();
    }

    ngOnInit() {
        this.onPlaceWordCommand();
    }

    private onPlaceWordCommand(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.placeWordCommandRequest)
            .subscribe((response: any) => {
                if (response !== undefined) {
                    console.log("Place Word response from the server ", response._data);

                    if (response._commandStatus === CommandStatus.Ok) {
                        // Create a well formatted response for the board manager
                        let position = new SquarePosition(response._data._squarePosition._row,
                            response._data._squarePosition._column);

                        let placeWordResponse: IPlaceWordResponse = {
                            _squarePosition: position,
                            _letters: response._data._letters,
                            _wordOrientation: response._data._wordOrientation
                        };

                        // Get a feedback from the manager if the word is placed
                        let isPlaced = this.boardManagerService.placeWordInBoard(placeWordResponse, this.board);
                    }
                }
            });
    }

    public placeWordInBoard(commandRequest: ICommandRequest<IPlaceWordResponse>) {
        this.socketService.emitMessage(SocketEventType.placeWordCommandRequest, commandRequest);
    }
}
