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
        stoneHandler.startPower();
        setTimeout(() => {

            stoneHandler.generateNewStone().then((stone1) => {
                stone1.position.set(0.27, 0, 0);

                stoneHandler.generateNewStone().then((stone2) => {
                    stone2.position.set(0, 0, -1);
                    stoneHandler.performShot(new Vector3(0, 0, 1), () => {}, 0.5);
                    stoneHandler.update(1);
                    stoneHandler.performShot(new Vector3(0, 0, 1), () => {}, 0.5);
                    stoneHandler.update(1);
                    stoneHandler.performShot(new Vector3(0, 0, 1), () => {}, 0.5);
                    stoneHandler.update(1);
                    done();
                });
            });

            for (let stone of stoneHandler.stoneOnTheGame){
                expect(stone.speed).to.not.be.equal(0, "stone" + stone + " was not in the collision");
            }
        }, 1000);
    });

    it("handle a collision between three stones", done => {
        stoneHandler.startPower();
        setTimeout(() => {
            stoneHandler.generateNewStone().then((stone1) => {

                stone1.position.set(-0.27, 0, 0);
                stoneHandler.generateNewStone().then((stone2) => {
                    stone2.position.set(0.27, 0, 0);

                    stoneHandler.generateNewStone().then((stone3) => {
                        stone3.position.set(0, 0, -1);
                        stoneHandler.performShot(new Vector3(0, 0, 1), () => {}, 0.5);
                        stoneHandler.update(1);
                        stoneHandler.performShot(new Vector3(0, 0, 1), () => {}, 0.5);
                        stoneHandler.update(1);
                        stoneHandler.performShot(new Vector3(0, 0, 1), () => {}, 0.5);
                        stoneHandler.update(1);
                        done();
                    });
                });
            });

            for (let stone of stoneHandler.stoneOnTheGame){
                expect(stone.speed).to.not.be.equal(0, "stone" + stone + " was not in the collision");
            }
        }, 1000);

    });
});
