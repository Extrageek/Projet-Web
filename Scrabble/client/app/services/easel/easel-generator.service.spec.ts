import { expect } from "chai";
import { EaselGeneratorService } from "./easel-generator.service";
import { ScrabbleLetter } from "../../models/letter/scrabble-letter";
import { Alphabet } from '../../models/letter/alphabet';

let service: EaselGeneratorService;
let easelStub: Array<ScrabbleLetter>;
let fakeLettersFromServer: Array<ScrabbleLetter>;

describe("Easel made out of Scrabble Letters validation", () => {

    before(() => {
        service = new EaselGeneratorService();
        fakeLettersFromServer = new Array<ScrabbleLetter>();
        fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterM));
        fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterA));
        fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterT));
        fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterH));
        fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterI));
        fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterE));
        fakeLettersFromServer.push(new ScrabbleLetter(Alphabet.letterU));
    });

    it("_lettersOnEasel property should be empty before generation", () => {
        expect(service.lettersOnEasel).to.be.undefined;
    });

    it("_lettersOnEasel property should be defined after generation", () => {
        service.generatedEasel(fakeLettersFromServer);
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
        easelStub = service.generatedEasel(fakeLettersFromServer);

        expect(easelStub).to.not.be.undefined;
        expect(easelStub).to.have.lengthOf(7);
    });
});
