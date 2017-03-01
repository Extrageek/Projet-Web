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
            expect(rink.material).to.exist;
            expect(rink.targetCenter).to.be.equal(Rink.TARGET_CENTER);
            expect(rink.targetRadius).to.be.equal(Rink.TARGET_RADIUS);
            expect(rink.initialStonePosition).to.be.equal(Rink.INITIAL_STONE_POSITION);
            done();
        });
    });
});
