import { Vector3 } from "three";
import { ComputerAI } from "./computerAI";
import { RinkInfo } from "./../scenery/rink-info.interface";
import { ShotParameters } from "./../shot-parameters.interface";
import { RandomHelper } from "./../random-helper";

export class NormalAI extends ComputerAI {

    private static readonly MIN_SHOT_POWER = 4;
    private static readonly MAX_SHOT_POWER = 4.5;
    private static readonly MIN_DIRECTION_MODIFIER = -0.07;
    private static readonly MAX_DIRECTION_MODIFIER = 0.07;

    constructor(rinkInfo: RinkInfo) {
        super(rinkInfo);
    }

    protected shotParametersOnStone(stonePositionToShotOnIt: Vector3): ShotParameters {
        return this.randomShot();
    }

    public determineShotParametersOnCenter(): ShotParameters {
        return this.randomShot();
    }

    private randomShot(): ShotParameters {
        let spin = RandomHelper.getIntegerNumberInRange(0, 1);
        console.log("spin");
        console.log(spin);
        return {
            spin: spin,
            direction: this.applyDirectionModification(ComputerAI.directionsToAimInCenter[spin].clone(),
                RandomHelper.getNumberInRangeIncluded(NormalAI.MIN_DIRECTION_MODIFIER,
                    NormalAI.MAX_DIRECTION_MODIFIER)),
            power: RandomHelper.getNumberInRangeIncluded(NormalAI.MIN_SHOT_POWER, NormalAI.MAX_SHOT_POWER)
        };
    }
}
