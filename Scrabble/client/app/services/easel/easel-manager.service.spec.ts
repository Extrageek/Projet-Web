import { Injectable } from '@angular/core';
import { ScrabbleLetter } from "../../models/letter/scrabble-letter";
import { Alphabet } from "../../models/letter/alphabet";
import { EaselControl } from '../../commons/easel-control';
import { EaselManagerService } from "./easel-manager.service";
import { EaselComponent } from "../../components/easel.component";
import { SocketService } from "../socket-service";
import { expect } from 'chai';

import { async, TestBed } from '@angular/core/testing';

const MIN_POSITION_INDEX = 0;
const MAX_POSITION_INDEX = 6;

describe("EaselManagerService should", () => {
    let service: EaselManagerService;

    beforeEach(() => {
        service = new EaselManagerService();
    });

    it("initialize the service correctly", () => {
        expect(service).to.not.be.undefined;
    });

    it("reconize if the tab key has been pressed", () => {
        let verification = service.isTabKey(EaselControl.tabKeyCode);
        expect(verification).to.be.true;
    });

    it("prevent a null keyCode to pretend to be a tab key", () => {
        let verification = () => service.isTabKey(null);
        expect(verification).to.throw(Error);
    });

    it("reconize when the tab key has not been pressed", () => {
        let verification = service.isTabKey(EaselControl.leftArrowKeyCode);
        expect(verification).to.be.false;
    });

    it("reconize if the leftArrowKey has been pressed as a direction key", () => {
        let verification = service.isDirection(EaselControl.leftArrowKeyCode);
        expect(verification).to.be.true;
    });

    it("reconize if the rightArrowKey has been pressed as a direction key", () => {
        let verification = service.isDirection(EaselControl.rightArrowKeyCode);
        expect(verification).to.be.true;
    });

    it("reconize if another key has been pressed as a direction key", () => {
        let verification = service.isDirection(EaselControl.letterKKeyCode);
        expect(verification).to.be.false;
    });

    it("prevent a null keyCode to pretend to be a direction key", () => {
        let verification = () => service.isDirection(null);
        expect(verification).to.throw(Error);
    });

    it("prevent a null keyCode to pretend to be a scrabbleLetter key", () => {
        let verification = () => service.isScrabbleLetter(null);
        expect(verification).to.throw(Error);
    });

    it("reconize any letter as a scrabbleLetter", () => {
        let keyCode: number;
        for (let index = EaselControl.letterAKeyCode; index >= EaselControl.letterZKeyCode; ++index) {
            keyCode = index;
            expect(() => service.isScrabbleLetter(index)).to.be.true;
        }
    });

    it("reconize another key to pretend to be a scrabbleLetter", () => {
        let keyCodeAfterLetterZ = EaselControl.letterZKeyCode + 1;
        let keyCodeBeforeLetterA = EaselControl.letterAKeyCode - 1;
        let verification = service.isScrabbleLetter(keyCodeBeforeLetterA);
        expect(verification).to.be.false;
        verification = service.isScrabbleLetter(keyCodeAfterLetterZ);
        expect(verification).to.be.false;
    });

    it("throw an exception when a null easelLenght is used in onKeyEventUpdate", () => {
        let verification = () => service.onKeyEventUpdateCurrentCursor(null, EaselControl.rightArrowKeyCode, 3);
        expect(verification).to.throw(Error);
    });

    it("throw an exception when a null keyCode is used in onKeyEventUpdate", () => {
        let verification = () => service.onKeyEventUpdateCurrentCursor(3, null, 1);
        expect(verification).to.throw(Error);
    });

    it("reconize a new cursor when leftArrowKey is used in onKeyEventUpdate with first position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, EaselControl.leftArrowKeyCode, MIN_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("reconize a new cursor when rightArrowKey are used in onKeyEventUpdate  with first position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, EaselControl.rightArrowKeyCode, MIN_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("reconize a new cursor when the tab key is used in onKeyEventUpdate  with first position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, EaselControl.tabKeyCode, MIN_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("put the cursor back to position 0 when other keys are used in onKeyEventUpdate  with first position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, EaselControl.letterOKeyCode, MIN_POSITION_INDEX);
        expect(verification).to.be.equal(0);
    });

    it("reconize a new cursor when leftArrowKey is used in onKeyEventUpdate with last position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, EaselControl.leftArrowKeyCode, MAX_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("reconize a new cursor when rightArrowKey are used in onKeyEventUpdate with last position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, EaselControl.rightArrowKeyCode, MAX_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("reconize a new cursor when the tab key is used in onKeyEventUpdate with last position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, EaselControl.tabKeyCode, MAX_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("put the cursor back to position 0 when other keys are used in onKeyEventUpdate with last position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, EaselControl.letterOKeyCode, MAX_POSITION_INDEX);
        expect(verification).to.be.equal(0);
    });

    it("allow to set focus on a letter with a valid index", () => {
        let verification = () => service.setFocusToElementWithGivenIndex(6, 2);
        expect(verification).to.not.throw(Error);
    });

    it("throw and exception if the text is null when trying to get a list of char", () => {
        let verification = () => service.parseStringToListofChar(null);
        expect(verification).to.throw(Error);
    });

    it("throw and exception if the text is not null when trying to get a list of char", () => {
        let response = service.parseStringToListofChar("abc");
        expect(response).to.be.an.instanceOf(Array);
    });

    it("throw and exception if the array is null when trying to get a list of string", () => {
        let verification = () => service.parseScrabbleLettersToListofChar(null);
        expect(verification).to.throw(Error);
    });

    it("throw and exception if the text is not null when trying to get a list of char", () => {
        let scrabbleLetters = new Array<ScrabbleLetter>();
        scrabbleLetters.push(new ScrabbleLetter(Alphabet.letterA));
        scrabbleLetters.push(new ScrabbleLetter(Alphabet.letterB));
        scrabbleLetters.push(new ScrabbleLetter(Alphabet.blank));
        let response = service.parseScrabbleLettersToListofChar(scrabbleLetters);
        expect(response).to.be.an.instanceOf(Array);
    });

    it("throw an error if the easelLetters is null when trying to get a scrabble letter from easel", () => {
        //let easelLetters = new Array<ScrabbleLetter>();
        let enteredLetters = [Alphabet.letterA, Alphabet.letterD];
        let verification = () => service.getScrabbleWordFromTheEasel(null, enteredLetters);
        expect(verification).to.throw(Error);
    });

    it("throw an error if the enteredLetters is null when trying to get a scrabble letter from easel", () => {
        let easelLetters = new Array<ScrabbleLetter>();
        easelLetters.push(new ScrabbleLetter(Alphabet.letterF));
        let verification = () => service.getScrabbleWordFromTheEasel(easelLetters, null);
        expect(verification).to.throw(Error);
    });
});
