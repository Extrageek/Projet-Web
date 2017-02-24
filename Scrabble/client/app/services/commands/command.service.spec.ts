import { Injectable } from '@angular/core';

import { EaselManagerService } from '../easel/easel-manager.service';
import { ScrabbleLetter } from '../../models/letter/scrabble-letter';
import { Alphabet } from '../../models/letter/alphabet';
import { CommandType } from './command-type';
import { CommandStatus } from './command-status';
import { ICommandRequest } from './command-request';
import { CommandsService } from './commands.service';

import { expect } from "chai";

export const EXCHANGE_COMMAND = '!changer';
export const PLACE_COMMAND = '!placer';
export const PASS_COMMAND = '!passer';
export const GUIDE = '!aide';

let _commandService: CommandsService;
let _easelManagerService: EaselManagerService;
//let _commandStatus: CommandStatus;
//let _response: any;
let _iCommandRequest: ICommandRequest<Array<number>> = { _commandStatus: null, _response: null };

describe("CommandService should", () => {

    beforeEach(() => {
        _easelManagerService = new EaselManagerService();
        _commandService = new CommandsService(_easelManagerService);
    });

    it("throw an exception when an input command is null", () => {
        let verification = () => _commandService.getInputCommandType(null);
        expect(verification).to.throw(Error);
    });

    it("throw an exception when an input command is empty", () => {
        let input = "";
        let verification = () => _commandService.getInputCommandType(null);
        expect(verification).to.throw(Error);
    });

    it("reconize the input to add a new word", () => {
        let verification = _commandService.getInputCommandType(PLACE_COMMAND);
        expect(verification).to.be.equal(CommandType.PlaceCmd);
    });

    it("reconize the input to exchange letters", () => {
        let verification = _commandService.getInputCommandType(EXCHANGE_COMMAND);
        expect(verification).to.be.equal(CommandType.ExchangeCmd);
    });

    it("reconize the input to let a player pass it's turn", () => {
        let verification = _commandService.getInputCommandType(PASS_COMMAND);
        expect(verification).to.be.equal(CommandType.PassCmd);
    });

    it("reconize the input to open help menu", () => {
        let verification = _commandService.getInputCommandType(GUIDE);
        expect(verification).to.be.equal(CommandType.Guide);
    });

    it("reconize an invalid command", () => {
        let input = "!";
        let verification = _commandService.getInputCommandType(input);
        expect(verification).to.be.equal(CommandType.InvalidCmd);
    });

    it("reconize the input of a valid message when it's not empty", () => {
        let input = "Hello World";
        let verification = _commandService.getInputCommandType(input);
        expect(verification).to.be.equal(CommandType.MessageCmd);
    });

    it("throw an exception if the letters in easel is null", () => {
        let lettersInEasel: Array<ScrabbleLetter>;
        lettersInEasel = null;
        let enteredLetters: Array<string>;
        enteredLetters = [Alphabet.letterC, Alphabet.letterB];

        let verification = () => _commandService.createExchangeEaselLettersRequest(lettersInEasel, enteredLetters);
        expect(verification).to.throw(Error);
    });

    it("return an syntax error response if the entered letters are null", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterJ));
        let enteredLetters: Array<string>;
        enteredLetters = null;

        _iCommandRequest = _commandService.createExchangeEaselLettersRequest(lettersInEasel, enteredLetters);
        expect(_iCommandRequest._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
        expect(_iCommandRequest._response).to.be.null;
    });

    it("return a syntax error response if there are more letters to change than in the easel", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterO));
        let enteredLetters: Array<string>;
        enteredLetters = [Alphabet.letterC, Alphabet.letterB];

        _iCommandRequest = _commandService.createExchangeEaselLettersRequest(lettersInEasel, enteredLetters);
        expect(_iCommandRequest._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
        expect(_iCommandRequest._response).to.be.null;
    });

    it("return a syntax error response if there are no letters entered", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterO));
        let enteredLetters: Array<string>;
        enteredLetters = [];

        _iCommandRequest = _commandService.createExchangeEaselLettersRequest(lettersInEasel, enteredLetters);
        expect(_iCommandRequest._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
        expect(_iCommandRequest._response).to.be.null;
    });

    it("return a valid response when exchanging letters inputs are good", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterC));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterD));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterE));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterF));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));
        let enteredLetters: Array<string>;
        enteredLetters = [Alphabet.letterA, Alphabet.letterB, Alphabet.letterC, Alphabet.letterD,
        Alphabet.letterE, Alphabet.letterF, Alphabet.blank];

        _iCommandRequest = _commandService.createExchangeEaselLettersRequest(lettersInEasel, enteredLetters);
        expect(_iCommandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
    });

    it("return a non valid response when exchanging letters inputs are not good", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));
        let enteredLetters: Array<string>;
        enteredLetters = ['*', Alphabet.letterK];

        _iCommandRequest = _commandService.createExchangeEaselLettersRequest(lettersInEasel, enteredLetters);
        expect(_iCommandRequest._commandStatus).to.be.equal(CommandStatus.NotAllowed);
    });
});
