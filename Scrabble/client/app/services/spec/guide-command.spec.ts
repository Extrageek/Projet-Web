import { NO_ERRORS_SCHEMA, } from "@angular/core";
import { APP_BASE_HREF } from "@angular/common";
import { RouterTestingModule, } from "@angular/router/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { GameRoomModule } from '../../modules/game-room.module';
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
import { CommandStatus } from "../commons/command-status";
import { CommandType } from "../commons/command-type";
import { SocketEventType } from '../../commons/socket-eventType';
import { GuideCommand } from "../guide-command";

import { SocketService } from "../socket-service";
import { EaselManagerService } from "../easel-manager.service";

import { Observable } from "rxjs/Observable";


describe("GuideCommand", function () {

    let guideCommand: GuideCommand;
    let chatroomComponent: ChatroomComponent;
    let fixture: ComponentFixture<ChatroomComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [GameRoomModule, GameStartModule],
            declarations: [],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/game-room/test' },
                SocketService,
                EaselManagerService
            ],

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatroomComponent);
        chatroomComponent = fixture.componentInstance;
        guideCommand = new GuideCommand(chatroomComponent);
    });

    it("GuideCommand should create an instance of a GuideCommand", () => {
        expect(guideCommand).to.be.not.undefined;
    });

    it("GuideCommand should a null argument error with a null ChatroomComponent", () => {
        let commandConstructor = () => new GuideCommand(null);
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("GuideCommand should create an instance of a GuideCommand with default values", () => {
        expect(guideCommand.commandRequest._commandType).to.be.equal(CommandType.GuideCmd);
        expect(guideCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
        expect(guideCommand.commandRequest._response).to.be.equal(GuideCommand.GUIDE_MESSAGE);
    });

    it("GuideCommand should execute the command without error", () => {
        expect(guideCommand.execute()).to.not.throw;
    });
});
