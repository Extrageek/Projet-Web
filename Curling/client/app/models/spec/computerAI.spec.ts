import { expect } from "chai";
import { Vector3, ObjectLoader, Object3D } from "three";
import { PerfectAI } from "../AI/perfectAI";
import { Rink } from "../scenery/rink";
import { RinkInfo } from "../scenery/rink-info.interface";
import { Stone, StoneColor } from "../stone";
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

describe("computerAI should", () => {

    it("construct itself", () => {
        expect(() => { new PerfectAI(rinkInfo); })
            .to.not.throw(Error);
    });
});

describe("computerAI should", () => {

    let computerAI: PerfectAI;
    let objectLoader: ObjectLoader;

    before(() => {
        objectLoader = new ObjectLoader();
    });

    beforeEach(() => {
        computerAI = new PerfectAI(rinkInfo);

    });

    it("throw stone at right position", done => {
        Stone.createStone(objectLoader, StoneColor.Red, rinkInfo.initialStonePosition)
            .then((stone: Stone) => {
                let shotParameters = computerAI.determineShotParametersOnCenter();
                console.log(shotParameters);
                stone.direction = shotParameters.direction;
                stone.speed = shotParameters.power;
                stone.spin = shotParameters.spin;
                updateLoopAndVerifyPosition(1000, stone, rinkInfo.targetCenter, done);
                console.log(stone.position);
            });
    });
});
