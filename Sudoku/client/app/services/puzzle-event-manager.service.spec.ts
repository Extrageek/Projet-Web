
import {
    fakeAsync,
    inject,
    TestBed
} from '@angular/core/testing';

import { assert } from 'chai';
import { PuzzleEventManagerService } from './puzzle-event-manager.service';
import { GridManagerService } from './grid-manager.service';
import { PuzzleCommon } from '../commons/puzzle-common';

describe('PuzzleEventManagerService', () => {

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                PuzzleEventManagerService,
                GridManagerService
            ]
        });
    });

    it("isDeleteKey, Should return false",
        inject([PuzzleEventManagerService],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let randomKey = 10;
                assert(eventManagerService.isDeleteKey(randomKey) === false,
                    "The value is not a Sudoku valid value");
            }))
    );

    it("isDeleteKey, Should return true because we give a delete keyCode",
        inject([PuzzleEventManagerService],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let sudokuKeyCode = PuzzleCommon.deleteKeyCode;
                assert(eventManagerService.isDeleteKey(sudokuKeyCode) === true,
                    "The sudoku key must have a value of 46");
            }))
    );

    it("isSudokuNumber, Should return true, it's a sudoku number",
        inject([PuzzleEventManagerService],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let sudokuKeyCode = PuzzleCommon.oneKey;
                assert(eventManagerService.isSudokuNumber(sudokuKeyCode) === true,
                    "The sudoku key must have a value of 46");
            }))
    );

    it("isSudokuNumber, Should return false , it's not a sudoku number",
        inject([PuzzleEventManagerService],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let fakeKeyCode = 100;
                assert(eventManagerService.isSudokuNumber(fakeKeyCode) === false,
                    "The sudoku key must have a value of 46");
            }))
    );

    it("isDirectionKey, Should return true, it's a direction key",
        inject([PuzzleEventManagerService],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let fakeDirectionKeyCode = PuzzleCommon.leftArrowKeyCode;
                assert(eventManagerService.isDirection(fakeDirectionKeyCode) === true,
                    "Must be a Sudoku number");
            }))
    );

    it("isDirectionKey, Should return false , it's not a direction number",
        inject([PuzzleEventManagerService],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let fakeNumberKeyCode = 100;
                assert(eventManagerService.isDirection(fakeNumberKeyCode) === false,
                    "It's not a direction key");
            }))
    );

    it("isDirectionKey, Should return false , it's not a direction number",
        inject([PuzzleEventManagerService],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {
                let fakeEvent = document.createEvent("KeyboardEvent");

                // fakeEvent.initKeyboardEvent(
                //                 "keyup" // in DOMString typeArg
                //                 , false // in boolean canBubbleArg
                //                 , false // in boolean cancelableArg
                //                 , global // in views::AbstractView viewArg
                //                 , "+" // [test]in DOMString keyIdentifierArg | webkit event.keyIdentifier | IE9 event.key
                //                 , 3 // [test]in unsigned long keyLocationArg | webkit event.keyIdentifier | IE9 event.location
                //                 , true // [test]in boolean ctrlKeyArg | webkit event.shiftKey | old webkit event.ctrlKey | IE9 event.modifiersList
                //                 , false // [test]shift | alt
                //                 , true // [test]shift | alt
                //                 , false // meta
                //                 , false // altGraphKey
                // );
            }))
    );

});
