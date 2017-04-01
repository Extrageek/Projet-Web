import { NO_ERRORS_SCHEMA, } from "@angular/core";
import { APP_BASE_HREF } from "@angular/common";
import { RouterTestingModule, } from "@angular/router/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { GameStartModule } from '../../modules/game-start.module';
import {
    fakeAsync,
    inject,
    ComponentFixture,
    TestBed,
    async,
} from '@angular/core/testing';

import { expect, assert } from "chai";

import { EaselComponent } from "../../components/easel.component";
import { ChatroomComponent } from "../../components/chatroom.component";
import { GameComponent } from "../../components/game-room.component";
import { GameInitiationComponent } from "../../components/game-initiation.component";
import { BoardComponent } from "../../components/board.component";

import { IScrabbleLetter } from "../../models/scrabble-letter";
import { Alphabet } from "../../models/commons/alphabet";
import { CommandStatus } from "../commons/command-status";
import { CommandType } from "../commons/command-type";
import { ICommandRequest } from "../commons/command-request.interface";
import { SocketEventType } from '../../commons/socket-eventType';
import { MessageCommand } from "../message-command";

import { EaselManagerService } from "../easel-manager.service";

import { Observable } from "rxjs/Observable";

describe("MessageCommand", function () {

    let messageCommand: MessageCommand;
    let chatroomComponent: ChatroomComponent;
    let fixture: ComponentFixture<ChatroomComponent>;
    let fakeMessage = "this is a fake message for test purpose";

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [GameStartModule],
            declarations: [],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/game-room/test' },
                EaselManagerService
            ],

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatroomComponent);
        chatroomComponent = fixture.componentInstance;
        messageCommand = new MessageCommand(chatroomComponent, fakeMessage);
    });

    it("MessageCommand should create an instance of a MessageCommand", () => {
        messageCommand = new MessageCommand(chatroomComponent, "a fake message for test purpose");
        expect(messageCommand).to.be.not.undefined;
    });

    it("MessageCommand should throw a null argument error with a null SocketService", () => {
        let commandConstructor = () => new MessageCommand(null, "a fake message for test purpose");
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("MessageCommand should throw a null argument error with a null parameters", () => {
        let commandConstructor = () => new MessageCommand(chatroomComponent, null);
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("MessageCommand should a null argument error with an empty parameters", () => {
        let commandConstructor = () => new MessageCommand(chatroomComponent, "");
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be empty");
    });

    it("MessageCommand should create an instance of a MessageCommand with default values", () => {
        expect(messageCommand).to.be.not.undefined;
        expect(messageCommand.parameters).to.be.equal(fakeMessage);
        expect(messageCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
        expect(messageCommand.commandRequest._commandType).to.be.equal(CommandType.MessageCmd);
    });

    it("MessageCommand should not throw an error when executing the command", () => {
        expect(messageCommand.execute()).to.not.throw;
    });

});
