import { expect } from "chai";
import { Vector3, ObjectLoader, Object3D } from "three";
import { ComputerAI } from "../computerAI";
import { Rink } from "../scenery/rink";
import { RinkInfo } from "../scenery/rink-info.interface";
import { Stone, StoneColor } from "../stone";
import { Difficulty } from "../difficulty";
import { ShotParameters } from "../shot-parameters.interface";
import { GameComponent } from "../game-component.interface";


function updateLoopAndVerifyPosition(numberOfUpdates: number,
    gameComponent: GameComponent & Object3D,
    positionToPass: Vector3,
    done: MochaDone
) {
    const tpf = 1 / 60;
    let i = 0;
    let stonePassedByThisPosition = false;
    while (!stonePassedByThisPosition && i < numberOfUpdates) {
        gameComponent.update(tpf);
        stonePassedByThisPosition = gameComponent.position.clone().sub(positionToPass).length() <
            Stone.BOUNDING_SPHERE_RADIUS;
        ++i;
    }
    if (stonePassedByThisPosition) {
        done();
    }
}

let rinkInfo: RinkInfo =
    {
        targetCenter: Rink.TARGET_CENTER,
        initialStonePosition: Rink.INITIAL_STONE_POSITION,
        targetRadius: 1
    };

let meanFriction = (Stone.SPEED_DIMINUTION_NUMBER + Stone.SPEED_DIMINUTION_NUMBER_WITH_SWEEP) / 2;

describe("computerAI should", () => {

    it("construct itself", () => {
        expect(() => { new ComputerAI(rinkInfo, meanFriction, Stone.THETA, Difficulty.HARD); })
            .to.not.throw(Error);
    });
});

describe("computerAI should", () => {

    let computerAI: ComputerAI;
    let objectLoader: ObjectLoader;

    before(() => {
        objectLoader = new ObjectLoader();
    });

    beforeEach(() => {
        computerAI = new ComputerAI(rinkInfo, meanFriction, Stone.THETA, Difficulty.PERFECT);

    });

    it("throw stone at right position", done => {
        Stone.createStone(objectLoader, StoneColor.Red, rinkInfo.initialStonePosition)
            .then((stone: Stone) => {
                let shotParameters = computerAI.determineNextShotParameters([], []);
                console.log(shotParameters);
                stone.direction = shotParameters.direction;
                stone.speed = shotParameters.power;
                stone.spin = shotParameters.spin;
                updateLoopAndVerifyPosition(1000, stone, rinkInfo.targetCenter, done);
                console.log(stone.position);
            });
    });
});
