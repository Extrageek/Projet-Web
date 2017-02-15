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

describe("StoneHandler tests should", () => {

    let objectLoader: ObjectLoader;
    let rinkInfo: RinkInfo;
    let stoneHandler: StoneHandler;
    let timeoutId: NodeJS.Timer;

    before(() => {
        objectLoader = new ObjectLoader();
        rinkInfo = {
            targetCenter: new Vector3(0, 0, -15),
            targetRadius: 3,
            initialStonePosition: new Vector3(0, 0, 0)
        };
    });

    beforeEach(() => {
        stoneHandler = new StoneHandler(objectLoader, rinkInfo, StoneColor.Blue);
    });

    afterEach(() => {
        clearTimeout(timeoutId);
    });

    it("throw error due to no stone generated", () => {
        expect(stoneHandler.performShot.bind(new Vector3(0, 0, 1), () => {})).to.throw(Error);
    });

    it("perform the launch and receive the callback when the shot finished", done => {
        stoneHandler.generateNewStone().then((stone: Stone) => {
            function update() {
                stoneHandler.update(0.2);
                timeoutId = setTimeout(update, 5);
            }
            stoneHandler.performShot(new Vector3(0, 0, 0.05), () => {
                clearTimeout(timeoutId);
                expect(stone.speed.length()).to.equals(0);
                done();
            });
            timeoutId = setTimeout(update, 5);
        });
    });
});
