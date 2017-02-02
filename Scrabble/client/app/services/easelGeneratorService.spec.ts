import { expect } from "chai";
import { EaselGeneratorService } from "./easelGeneratorService";
import { ScrabbleLetter } from "../models/scrabble-letter";

let service : EaselGeneratorService;
let easelStub : ScrabbleLetter[];

describe("Easel made out of Scrabble Letters validation", () => {

    before(() => {
        service = new EaselGeneratorService();
    });

    it("_lettersOnEasel property should be empty before generation", () => {
        expect(service.lettersOnEasel).to.be.undefined;
    });

    it("_lettersOnEasel property should be defined after generation", () => {
        service.generatedEasel();
        expect(service.lettersOnEasel).to.not.be.undefined;
    });

    it("_lettersOnEasel property should contain 7 objects", () => {
        expect(service.lettersOnEasel).to.have.lengthOf(7);
    });

    it("_lettersOnEasel to contain all objects of ScrabbleLetter", () => {
        for (let letter of service.lettersOnEasel) {
            expect(letter).to.be.an.instanceof(ScrabbleLetter);
        }
    });

    it("should correctly initialize the easelStub", () => {
        expect(easelStub).to.be.undefined;
        easelStub = service.generatedEasel();

        expect(easelStub).to.not.be.undefined;
        expect(easelStub).to.have.lengthOf(7);
    });

    it("should generate two different easel stubs easelStub", () => {
        easelStub = service.generatedEasel();
        let secondEaselStub = service.generatedEasel();

        expect(easelStub).to.not.equal(secondEaselStub);
        expect(easelStub).to.not.deep.equal(secondEaselStub);
    });
});


