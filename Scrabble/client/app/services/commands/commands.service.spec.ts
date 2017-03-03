import { Injectable } from "@angular/core";

import { EaselManagerService } from "../easel/easel-manager.service";
import { ScrabbleLetter } from "../../models/letter/scrabble-letter";
import { Alphabet } from "../../models/letter/alphabet";
import { CommandType } from "./command-type";
import { CommandStatus } from "./command-status";
import { CommandsHelper } from "./commands-helper";
import { ICommandRequest } from "./command-request";
import { CommandsService } from "./commands.service";

import { expect } from "chai";

let _commandService: CommandsService;
let _easelManagerService: EaselManagerService;
let _iCommandRequest: ICommandRequest<Array<number>> = { _commandStatus: null, _response: null };

describe("CommandService should", () => {

    beforeEach(() => {
        _easelManagerService = new EaselManagerService();
        _commandService = new CommandsService(_easelManagerService);
    });

    it("throw an exception when an input command is null", () => {
        let verification = () => _commandService.getCommandType(null);
        expect(verification).to.throw(Error);
    });

    it("throw an exception when an input command is empty", () => {
        let input = "";
        let verification = () => _commandService.getCommandType(null);
        expect(verification).to.throw(Error);
    });

    it("reconize the input to add a new word", () => {
        let verification = _commandService.getCommandType(CommandsHelper.PLACE_COMMAND);
        expect(verification).to.be.equal(CommandType.PlaceCmd);
    });

    it("reconize the input to exchange letters", () => {
        let verification = _commandService.getCommandType(CommandsHelper.EXCHANGE_COMMAND);
        expect(verification).to.be.equal(CommandType.ExchangeCmd);
    });

    it("reconize the input to let a player pass it's turn", () => {
        let verification = _commandService.getCommandType(CommandsHelper.PASS_COMMAND);
        expect(verification).to.be.equal(CommandType.PassCmd);
    });

    it("reconize the input to open help menu", () => {
        let verification = _commandService.getCommandType(CommandsHelper.GUIDE);
        expect(verification).to.be.equal(CommandType.Guide);
    });

    it("reconize an invalid command", () => {
        let input = "!";
        let verification = _commandService.getCommandType(input);
        expect(verification).to.be.equal(CommandType.InvalidCmd);
    });

    it("reconize the input of a valid message when it's not empty", () => {
        let input = "Hello World";
        let verification = _commandService.getCommandType(input);
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
        // let enteredLetters: Array<string>;
        // enteredLetters = null;

        _iCommandRequest = _commandService.createExchangeEaselLettersRequest(lettersInEasel, null);
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

    it("return a not allowed error response if there are no letters entered", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterO));
        let enteredLetters: Array<string>;
        enteredLetters = [];

        _iCommandRequest = _commandService.createExchangeEaselLettersRequest(lettersInEasel, enteredLetters);
        expect(_iCommandRequest._commandStatus).to.be.equal(CommandStatus.NotAllowed);
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

    it("throw an error when there are no letters to be placed on the board", () => {
        let request = "e4v a";
        let verification = () => _commandService.createPlaceWordRequest(null, request);
        expect(verification).to.throw(Error);
    });

    it("not reconize an empty array of string as scrabble letters", () => {
        let letters = new Array<string>();
        letters = [];

        let verification = _commandService.isScrabbleLetters(letters);
        expect(verification).to.be.false;
    });

    it("reconize a valid array of string as scrabble letters", () => {
        let letters = new Array<string>();
        letters.push(Alphabet.letterA);
        letters.push(Alphabet.letterB);

        let verification = _commandService.isScrabbleLetters(letters);
        expect(verification).to.be.true;
    });

    it("reconize an array including * as scrabble letters", () => {
        let letters = new Array<ScrabbleLetter>();
        //letters.push(new ScrabbleLetter(Alphabet.letterR));
        letters.push(new ScrabbleLetter(Alphabet.blank));

        let stringArray = new Array<string>();
        stringArray = _easelManagerService.parseScrabbleLettersToListofChar(letters);

        let verification = _commandService.isScrabbleLetters(stringArray);
        expect(verification).to.be.true;
    });

    it("validate a good entry to place a word request vertical", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));
        let request = "e4v ab*";
        let verification = _commandService.createPlaceWordRequest(lettersInEasel, request);
        expect(verification._commandStatus).to.be.equal(CommandStatus.Ok);
    });

    it("validate a good entry to place a word request vertical", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));
        let request = "e4h ab*";
        let verification = _commandService.createPlaceWordRequest(lettersInEasel, request);
        expect(verification._commandStatus).to.be.equal(CommandStatus.Ok);
    });

    it("should not validate a word when placing a word request", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));
        let request = "a4v cd";
        let verification = _commandService.createPlaceWordRequest(lettersInEasel, request);
        expect(verification._commandStatus).to.be.equal(CommandStatus.NotAllowed);
    });

    it("should not validate a wrong letter when writing a word request", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));
        let request = "a4v ....";
        let verification = _commandService.createPlaceWordRequest(lettersInEasel, request);
        expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
    });

    it("should not validate a wrong position when writing a word request", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));
        let request = "a34v ab";
        let verification = _commandService.createPlaceWordRequest(lettersInEasel, request);
        expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
    });

    it("should not validate a wrong position when writing a word request", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));
        let request = "a0v ab";
        let verification = _commandService.createPlaceWordRequest(lettersInEasel, request);
        expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
    });

    it("should not validate a wrong position when writing a word request", () => {
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));
        let request = "a.v ab";
        let verification = _commandService.createPlaceWordRequest(lettersInEasel, request);
        expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
    });
});
