import { NO_ERRORS_SCHEMA, } from "@angular/core";
import { APP_BASE_HREF } from "@angular/common";
import { GameStartModule } from '../../modules/game-start.module';
import {
    ComponentFixture,
    TestBed,
    async,
} from '@angular/core/testing';

import { expect } from "chai";

import { ChatroomComponent } from "../../components/chatroom.component";
import { CommandStatus } from "../commons/command-status";
import { CommandType } from "../commons/command-type";
import { GuideCommand } from "../guide-command";

import { EaselManagerService } from "../easel-manager.service";

describe("GuideCommand", function () {

    let guideCommand: GuideCommand;
    let chatroomComponent: ChatroomComponent;
    let fixture: ComponentFixture<ChatroomComponent>;

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
