import { Vector3 } from "three";
import { ComputerAI } from "./computerAI";
import { IRinkInfo } from "./../scenery/rink-info.interface";
import { RandomHelper } from "./../random-helper";
import { IShotParameters } from "./../shot-parameters.interface";

export class HardAI extends ComputerAI {

    private static readonly MIN_SHOT_POWER = 4.1;
    private static readonly MAX_SHOT_POWER = 4.3;
    private static readonly MIN_SHOT_TO_PUSH_STONE = 5.2;
    private static readonly MAX_SHOT_TO_PUSH_STONE = 5.8;
    private static readonly MIN_DIRECTION_MODIFIER = -0.02;
    private static readonly MAX_DIRECTION_MODIFIER = 0.02;
    private static readonly MIN_PUSH_DIRECTION_MODIFIER = -0.01;
    private static readonly MAX_PUSH_DIRECTION_MODIFIER = 0.01;

    constructor(rinkInfo: IRinkInfo) {
        super(rinkInfo);
    }

    protected shotParametersOnStone(stonePositionToShotOnIt: Vector3): IShotParameters {
        //Determine random shotPower and spin.
        let shotParameters: IShotParameters = {
            spin: RandomHelper.getIntegerNumberInRange(0, 1),
            direction: null,
            power: RandomHelper.getNumberInRangeIncluded(HardAI.MIN_SHOT_TO_PUSH_STONE, HardAI.MAX_SHOT_TO_PUSH_STONE)
        };

        //Determine the direction.
        this._physicEngine.speed = shotParameters.power;
        this._physicEngine.spin = shotParameters.spin;
        this._physicEngine.position.copy(this._rinkInfo.initialStonePosition);
        let direction = this._physicEngine.calculateDirectionToPassAtPosition(stonePositionToShotOnIt);
        if (direction !== null) {
            shotParameters.direction = this.applyDirectionModification(direction,
                RandomHelper.getNumberInRangeIncluded(HardAI.MIN_PUSH_DIRECTION_MODIFIER,
                    HardAI.MAX_PUSH_DIRECTION_MODIFIER));
        } else {
            //If the powers specified in the constants are enough, we never should pass here.
            shotParameters = this.determineShotParametersOnCenter();
        }

        return shotParameters;
    }

    public determineShotParametersOnCenter(): IShotParameters {
        let spin = RandomHelper.getIntegerNumberInRange(0, 1);
        return {
            spin: spin,
            direction: this.applyDirectionModification(ComputerAI.directionsToAimInCenter[spin].clone(),
                RandomHelper.getNumberInRangeIncluded(HardAI.MIN_DIRECTION_MODIFIER, HardAI.MAX_DIRECTION_MODIFIER)),
            power: RandomHelper.getNumberInRangeIncluded(HardAI.MIN_SHOT_POWER, HardAI.MAX_SHOT_POWER)
        };
    }
}
