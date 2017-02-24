import { Injectable } from '@angular/core';
import { ScrabbleLetter } from "../../models/letter/scrabble-letter";
import { EaselControl } from "../../commons/easel-control";
import { GameRoomManagerService } from "./game-room-manager.service";

import { expect } from 'chai';

describe("GameRoomManagerService should", () => {
    let service: GameRoomManagerService;

    beforeEach(() => {
        service = new GameRoomManagerService();
    });

    it("initialize the service correctly", () => {
        expect(service).to.not.be.undefined;
    });

    it("reconize if the tab key has been pressed", () => {
        let verification = service.isTabKey(EaselControl.tabKeyCode);
        expect(verification).to.be.true;
    });

    it("should prevent a null keyCode to have any event", () => {
        let verification = () => service.isTabKey(null);
        expect(verification).to.throw(Error);
    });

    it("reconize when the tab key has not been pressed", () => {
        let verification = service.isTabKey(EaselControl.leftArrowKeyCode);
        expect(verification).to.be.false;
    });
});
