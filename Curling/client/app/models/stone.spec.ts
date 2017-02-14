import { expect } from "chai";
import { ObjectLoader, Vector3 } from "three";
import { Stone, StoneColor } from "./stone";

describe("Stone tester should", () => {

    let objectLoader: ObjectLoader;

    before(() => {
        objectLoader = new ObjectLoader();
    });

    it("load red stone", done => {
        Stone.createStone(objectLoader, StoneColor.Red, new Vector3(0, 0, 0)).then((stone: Stone) => {
            expect(stone).to.be.instanceof(Stone);
            expect(stone.stoneColor).to.equals(StoneColor.Red);
            done();
        });
    });

    it("load blue stone", done => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0)).then((stone: Stone) => {
            expect(stone).to.be.instanceof(Stone);
            expect(stone.stoneColor).to.equals(StoneColor.Blue);
            done();
        });
    });
});
