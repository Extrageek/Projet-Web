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
import { CommandStatus } from "../commons/command-status";
import { CommandType } from "../commons/command-type";
import { SocketEventType } from '../../../commons/socket-eventType';
import { PassCommand } from "./pass-command";

import { SocketService } from "../../socket-service";
import { EaselManagerService } from "../../easel/easel-manager.service";

import { Observable } from "rxjs/Observable";


describe("PassCommand", function () {

    let passCommand: PassCommand;
    let gameComponent: GameComponent;
    let fixture: ComponentFixture<GameComponent>;
    let fakeMessage = "this is a fake message for test purpose";

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [GameRoomModule, GameStartModule],
            declarations: [],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/game-room/test' },
                SocketService,
                EaselManagerService,
            ],

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameComponent);
        gameComponent = fixture.componentInstance;
        passCommand = new PassCommand(gameComponent);
    });

    it("PassCommand should create an instance of a PassCommand", () => {
        expect(passCommand).to.be.not.undefined;
    });

    it("PassCommand should a null argument error with a null SocketService", () => {
        let commandConstructor = () => new PassCommand(null);
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("PassCommand should create an instance of a PassCommand with default values", () => {
        expect(passCommand.commandRequest._response).to.be.equal("");
        expect(passCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
        expect(passCommand.commandRequest._commandType).to.be.equal(CommandType.PassCmd);
    });

    it("PassCommand should execute the command without error", () => {
        expect(passCommand.execute()).to.not.throw;
    });
});
