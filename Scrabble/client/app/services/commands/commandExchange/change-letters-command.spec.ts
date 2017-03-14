import { NO_ERRORS_SCHEMA, } from "@angular/core";
import { APP_BASE_HREF } from "@angular/common";
import { RouterTestingModule, } from "@angular/router/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { GameRoomModule } from '../../../modules/game-room.module';
import { GameStartModule } from '../../../modules/game-start.module';
import {
    fakeAsync,
    inject,
    ComponentFixture,
    TestBed,
    async,
} from '@angular/core/testing';

import { expect, assert } from "chai";

import { EaselComponent } from "../../../components/easel.component";
import { ChatroomComponent } from "../../../components/chatroom.component";
import { GameComponent } from "../../../components/game-room.component";
import { GameInitiationComponent } from "../../../components/game-initiation.component";
import { BoardComponent } from "../../../components/board.component";
import { ScrabbleLetter } from "../../../models/letter/scrabble-letter";
import { Alphabet } from "../../../models/letter/alphabet";
import { CommandStatus } from "./../commons/command-status";
import { CommandType } from "./../commons/command-type";
import { ICommandRequest } from "./../commons/command-request";
import { SocketEventType } from '../../../commons/socket-eventType';
import { ChangeLettersCommand } from "./change-letters-command";

import { SocketService } from "../../../services/socket-service";
import { EaselManagerService } from "../../easel/easel-manager.service";

import { Observable } from "rxjs/Observable"

let changeLettersCommand: ChangeLettersCommand;
let commandRequest: ICommandRequest<
    {
        indexOfLettersToChange: Array<number>,
        lettersToChange: Array<string>
    }>

const Routes = [
    { path: "", redirectTo: "/game-start", pathMatch: "full" },
    { path: "game-start", component: GameComponent },
    { path: "game-room/:id", component: GameComponent, data: { id: "" } },
];

class MockRouter { public navigate() { }; }
class MockActivatedRoute {
    Params: { "id": "math" };
    constructor() {
        //
    }

    /** An observable of the matrix parameters scoped to this route */
    params = new Observable((observer: any) => {
        observer.next(this.Params);
    });
}

describe("ChangeLetterCommand", function () {

    let easelComponent: EaselComponent;
    let fixture: ComponentFixture<EaselComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [GameRoomModule, GameStartModule, RouterTestingModule.withRoutes(Routes)],
            declarations: [],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/game-room/test' },
                // { provide: Router, useClass: MockRouter },
                // { provide: ActivatedRoute, useClass: MockRouter },
                SocketService,
                EaselManagerService,
            ],

        })
            .compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(EaselComponent);
        easelComponent = fixture.componentInstance;

        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterA));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterB));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterC));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterD));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterE));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterF));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.blank));
    });

    it("ChangeLetterCommand should not be undefined", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "abcdefg");
        expect(changeLettersCommand).to.be.not.undefined;
    });

    it("ChangeLettersCommand should a null argument error with a null EaselComponent", () => {
        let commandConstructor = () => new ChangeLettersCommand(null, "a fake message for test purpose");
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("ChangeLettersCommand should create an instance of a ChangeLettersCommand with default values", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "abc");
        expect(changeLettersCommand).to.be.not.undefined;

        expect(changeLettersCommand.commandRequest._response.indexOfLettersToChange).to.be.instanceOf(Array);
        expect(changeLettersCommand.commandRequest._response.lettersToChange).to.be.instanceOf(Array);
        expect(changeLettersCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Unknown);
        expect(changeLettersCommand.commandRequest._commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("ChangeLettersCommand should execute and send 1 letter to the EaselComponent", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "a");
        changeLettersCommand.execute();

        expect(changeLettersCommand.commandRequest._response.indexOfLettersToChange).to.be.deep.equals([0]);
        expect(changeLettersCommand.commandRequest._response.lettersToChange).to.be.deep.equals(['A']);
        expect(changeLettersCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
        expect(changeLettersCommand.commandRequest._commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("ChangeLettersCommand should execute and send 3 letters to the EaselComponent", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "abc");
        changeLettersCommand.execute();

        expect(changeLettersCommand.commandRequest._response.indexOfLettersToChange).to.be.deep.equals([0, 1, 2]);
        expect(changeLettersCommand.commandRequest._response.lettersToChange).to.be.deep.equals(['A', 'B', 'C']);
        expect(changeLettersCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
        expect(changeLettersCommand.commandRequest._commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("ChangeLettersCommand should execute and send 7 letters to the EaselComponent", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "abc*efd");
        changeLettersCommand.execute();

        expect(changeLettersCommand.commandRequest._response.indexOfLettersToChange).to.be.deep.equals([0, 1, 2, 6, 4, 5, 3]);
        expect(changeLettersCommand.commandRequest._response.lettersToChange).to.be.deep.equals(['A', 'B', 'C', 'blank', 'E', 'F', 'D']);
        expect(changeLettersCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
        expect(changeLettersCommand.commandRequest._commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("ChangeLettersCommand should execute and send 7 letters to the EaselComponent", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "abc*efd");
        changeLettersCommand.execute();

        expect(changeLettersCommand.commandRequest._response.indexOfLettersToChange).to.be.deep.equals([0, 1, 2, 6, 4, 5, 3]);
        expect(changeLettersCommand.commandRequest._response.lettersToChange).to.be.deep.equals(['A', 'B', 'C', 'blank', 'E', 'F', 'D']);
        expect(changeLettersCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
        expect(changeLettersCommand.commandRequest._commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("ChangeLettersCommand should execute and send NotAllowed request with not existing letters in the easel", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "az*jw");
        changeLettersCommand.execute();

        assert(changeLettersCommand.commandRequest._response.indexOfLettersToChange.length === 0);
        expect(changeLettersCommand.commandRequest._response.lettersToChange).to.be.deep.equals(['A', 'Z', '*', 'J', 'W']);
        expect(changeLettersCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.NotAllowed);
        expect(changeLettersCommand.commandRequest._commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("ChangeLettersCommand should execute and send SynthaxeError request if we have more than 7 letters to change", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "abcd*abcd");
        changeLettersCommand.execute();

        assert(changeLettersCommand.commandRequest._response.indexOfLettersToChange.length === 0);
        expect(changeLettersCommand.commandRequest._response.lettersToChange).to.be.deep.equals(['A', 'B', 'C', 'D', 'blank', 'A', 'B', 'C', 'D']);
        expect(changeLettersCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
        expect(changeLettersCommand.commandRequest._commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("ChangeLettersCommand should execute and send NotAllowed request", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "azc*efd");
        changeLettersCommand.execute();

        assert(changeLettersCommand.commandRequest._response.indexOfLettersToChange.length === 0);
        expect(changeLettersCommand.commandRequest._response.lettersToChange).to.be.deep.equals(['A', 'Z', 'C', '*', 'E', 'F', 'D']);
        expect(changeLettersCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.NotAllowed);
        expect(changeLettersCommand.commandRequest._commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("throw an exception if the letters in easel is null", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "a*e");

        let lettersInEasel: Array<ScrabbleLetter>;
        lettersInEasel = null;

        let verification = () => changeLettersCommand.createExchangeEaselLettersRequest(lettersInEasel);
        expect(verification).to.throw(Error);
    });

    it("return an not allowed response if the entered letters are null", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "a*e");

        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterJ));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterF));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterT));

        console.log("response", changeLettersCommand.commandRequest);
        commandRequest = changeLettersCommand.createExchangeEaselLettersRequest(lettersInEasel);
        expect(commandRequest._commandStatus).to.be.equal(CommandStatus.NotAllowed);
        assert(commandRequest._response.indexOfLettersToChange.length === 0);
    });

    it("return a syntax error response if there are more letters to change than what we are in the easel", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "a*e");
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterO));

        commandRequest = changeLettersCommand.createExchangeEaselLettersRequest(lettersInEasel);
        expect(commandRequest._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
        assert(commandRequest._response.indexOfLettersToChange.length === 0);
    });

    it("return a not allowed error response if there are no letters entered", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "");
        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterO));

        commandRequest = changeLettersCommand.createExchangeEaselLettersRequest(lettersInEasel);
        expect(commandRequest._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
        assert(commandRequest._response.indexOfLettersToChange.length === 0);
    });

    it("return a valid response when exchanging letters inputs are good", () => {
        changeLettersCommand = new ChangeLettersCommand(easelComponent, "a*e");

        let lettersInEasel = new Array<ScrabbleLetter>();
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterA));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterB));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterC));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterD));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterE));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.letterF));
        lettersInEasel.push(new ScrabbleLetter(Alphabet.blank));

        commandRequest = changeLettersCommand.createExchangeEaselLettersRequest(lettersInEasel);
        expect(commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
    });
});
