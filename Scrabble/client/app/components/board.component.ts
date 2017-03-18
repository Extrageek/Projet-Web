import { Component, OnInit } from "@angular/core";

import { IScrabbleLetter } from "../models/scrabble-letter";
import { ISquare } from '../models/square';
import { ISquarePosition } from '../models/square-position';
import { Board } from '../models/board';

import { SocketEventType } from "../commons/socket-eventType";
import { SocketService } from "../services/socket-service";
import { BoardManagerService } from "../services/board-manager.service";
import { ExceptionHelperService } from "../services/exception-helper.service";

import { IPlaceWordResponse } from "../services/place-command-response.interface";
import { CommandType } from "../services/commons/command-type";
import { CommandStatus } from "../services/commons/command-status";
import { ICommandRequest } from '../services/commons/command-request';
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
    }

    ngOnInit() {
        // this.onPlaceWordCommand();
        this.onUpdateBoardEvent();
    }

    private onPlaceWordCommand(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.PLACE_WORD_COMMAND_REQUEST)
            .subscribe((response: any) => {
                if (response !== undefined) {
                    console.log("Place Word response from the server ", response._data);

                    if (response._commandStatus === CommandStatus.Ok) {
                        // Create a well formatted response for the board manager
                        let position = {
                            _row: response._data._squarePosition._row,
                            _column: response._data._squarePosition._column
                        };

                        let placeWordResponse: IPlaceWordResponse = {
                            _squarePosition: position,
                            _letters: response._data._letters,
                            _wordOrientation: response._data._wordOrientation
                        };

                        // Get a feedback from the manager if the word is placed
                        //let isPlaced = this.boardManagerService.placeWordInBoard(placeWordResponse, this.board);
                    }
                }
            });
    }

    private onUpdateBoardEvent() {
        this.socketService.subscribeToChannelEvent(SocketEventType.UPDATE_BOARD)
            .subscribe((response: any) => {
                if (response !== undefined) {
                    console.log("Board response from the server ", response);
                    this.board = new Board(response._squares);
                    console.log(this.board);
                }
            });
    }

    public placeWordInBoard(commandRequest: ICommandRequest<IPlaceWordResponse>) {
        this.socketService.emitMessage(SocketEventType.PLACE_WORD_COMMAND_REQUEST, commandRequest);
    }
}
