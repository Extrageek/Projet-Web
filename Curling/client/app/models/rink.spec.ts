import { expect } from "chai";
import { Rink } from "./rink";
import { ObjectLoader } from "three";

describe("Rink class should", () => {

    let objectLoader: ObjectLoader;

    before(() => {
        objectLoader = new ObjectLoader();
    });

    it("instantiate a rink object", done => {
        Rink.createRink(objectLoader).then((rink: Rink) => {
            expect(rink).to.be.instanceof(Rink);
            done();
        });
    });
});
