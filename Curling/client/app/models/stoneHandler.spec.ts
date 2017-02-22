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
        expect(stoneHandler.performShot.bind(1, new Vector3(0, 0, 1))).to.throw(Error);
    });

    it("handle a collision between two stones", done => {
        stoneHandler.generateNewStone().then((stoneCollided: Stone) => {
            function update() {
                stoneHandler.update(0.2);
                timeoutId = setTimeout(update, 5);
            }
            stoneHandler.generateNewStone().then((stoneColliding: Stone) => {
                stoneCollided.position.set(0, 0, 1);
                stoneColliding.position.set(0, 0, 0);
                stoneHandler.performShot(3, new Vector3(0, 0, 1), () => {
                    clearTimeout(timeoutId);
                    expect(stoneCollided.speed).to.not.equals(0);
                    expect(stoneColliding.speed).to.not.equals(3);
                    done();
                });
            timeoutId = setTimeout(update, 5);
            });
        });
    });

    it("handle a collision between three stones", done => {
        stoneHandler.generateNewStone().then((stoneCollided2: Stone) => {
            stoneCollided2.position.set(0, 0, 2);
            stoneHandler.generateNewStone().then((stoneCollided1: Stone) => {
                function update() {
                    stoneHandler.update(0.2);
                    timeoutId = setTimeout(update, 5);
                }
                stoneHandler.generateNewStone().then((stoneColliding: Stone) => {
                    stoneCollided1.position.set(0, 0, 1);
                    stoneColliding.position.set(0, 0, 0);

                    stoneHandler.performShot(3, new Vector3(0, 0, 1), () => {
                        clearTimeout(timeoutId);
                        expect(stoneCollided1.speed).to.not.equals(0);
                        expect(stoneColliding.speed).to.not.equals(1);
                        done();
                    });
                    timeoutId = setTimeout(update, 5);
                });
            });
        });
    });
});
