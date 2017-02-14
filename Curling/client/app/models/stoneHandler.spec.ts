import { expect } from "chai";
import { ObjectLoader, Vector3 } from "three";
import { StoneHandler } from "./stoneHandler";
import { Stone, StoneColor } from "./stone";
import { RinkInfo } from "./rinkInfo.interface";

describe("StoneHandler tests should", () => {

    let objectLoader: ObjectLoader;
    let rinkInfo: RinkInfo;


    before(() => {
        objectLoader = new ObjectLoader();
        rinkInfo = {
            targetCenter: new Vector3(0, 0, -15),
            targetRadius: 3,
            initialStonePosition: new Vector3(0, 0, 0)
        };
    });

    it("create a StoneHandler and generate a red stone", done => {
        let stoneHandler = new StoneHandler(objectLoader, rinkInfo, StoneColor.Red);
        stoneHandler.generateNewStone().then((stone: Stone) => {
            expect(stone.stoneColor).to.equals(StoneColor.Red);
            done();
        });
    });

    it("create a StoneHandler and generate a blue stone", done => {
        let stoneHandler = new StoneHandler(objectLoader, rinkInfo, StoneColor.Blue);
        stoneHandler.generateNewStone().then((stone: Stone) => {
            expect(stone.stoneColor).to.equals(StoneColor.Blue);
            done();
        });
    });
});
