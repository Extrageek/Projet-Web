import { expect } from 'chai';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { DebugElement } from '@angular/core';

import { EaselComponent } from "./easel.component";
import { ScrabbleLetter } from "../models/scrabble-letter";
import { EaselGeneratorService } from "../services/easelGeneratorService";

describe("Easel component", () => {
    let comp: EaselComponent;
    let fixture: ComponentFixture<EaselComponent>;
    let de: DebugElement;

    let service: EaselGeneratorService;

    // async beforeEach
    beforeEach(async (() => {
        TestBed.configureTestingModule({
            declarations: [ EaselComponent ],
            providers: [ EaselGeneratorService ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EaselComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        service = fixture.debugElement.injector.get(EaselGeneratorService);
    });

    it("should initialize an easel with 7 letters", () => {
        expect(comp.letters).to.be.undefined;
        fixture.detectChanges();
        expect(comp.letters).to.have.lengthOf(7);
        expect(comp.letters[0]).to.be.an.instanceof(ScrabbleLetter);
    });
});
