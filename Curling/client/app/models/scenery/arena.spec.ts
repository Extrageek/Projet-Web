import { expect } from "chai";
import { Arena } from "./arena";
import { ObjectLoader } from "three";

describe("Arena class should", () => {

    let objectLoader: ObjectLoader;

    before(() => {
        objectLoader = new ObjectLoader();
    });

    it("instantiate an arena object", done => {
        Arena.createArena(objectLoader).then((arena: Arena) => {
            expect(arena).to.be.instanceof(Arena);
            expect(arena.material).to.exist;
            done();
        });
    });
});
