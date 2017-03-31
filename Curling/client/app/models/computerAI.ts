import { Vector3, Matrix3 } from "three";
import { RinkInfo } from "./scenery/rink-info.interface";
import { Difficulty } from "./difficulty";
import { RandomHelper } from "./random-helper";
import { ShotParameters } from "./shot-parameters.interface";
import { StoneSpin } from "./stone";

export class ComputerAI {

    //Different ranges following the difficulty enumeration
    private static readonly INTERVAL_MAX_SHOOT_POWER = [
        { min: 2, max: 3.8 },
        { min: 3, max: 3.8 },
        { min: 4.21, max: 4.21 }
    ];
    //This constant is used to adjust the direction when launching the stone. Because it is difficult to calculate
    //the direction that the stone must take with the physic calculation. This constant is used instead.
    //WARNING : If the physic changes, this constant must be adjusted.
    private static readonly DIRECTION_ADJUSTMENT = 25;

    private _rinkInfo: RinkInfo;
    private _meanFrictionCoefficients: number;
    private _rotationDisplacementAngle: number;
    private _difficulty: Difficulty;
    private _minShotPower: number;
    private _maxShotPower: number;

    constructor(rinkInfo: RinkInfo,
        frictionCoefficients: number,
        rotationDisplacementAngle: number,
        difficulty: Difficulty) {
        this._rinkInfo = rinkInfo;
        this._meanFrictionCoefficients = frictionCoefficients;
        this._rotationDisplacementAngle = rotationDisplacementAngle;
        this._minShotPower = ComputerAI.INTERVAL_MAX_SHOOT_POWER[difficulty].min;
        this._maxShotPower = ComputerAI.INTERVAL_MAX_SHOOT_POWER[difficulty].max;
    }

    public determineNextShotParameters(
        playerStonePositions: Array<Vector3>,
        computerStonePositions: Array<Vector3>): ShotParameters {
        let shotParameters: ShotParameters;
        let playerClosestStone = this.findClosestStone(playerStonePositions);
        if (playerClosestStone == null) {
            shotParameters = this.determineShotParameters(
                this._rinkInfo.targetCenter,
                this._minShotPower,
                this._maxShotPower
            );
        } else {
            shotParameters = this.determineShotParameters(
                playerClosestStone,
                this._minShotPower,
                this._maxShotPower
            );
        }

        return shotParameters;
    }

    private findClosestStone(stonePositions: Array<Vector3>) {
        let closestStonePosition: Vector3;
        if (stonePositions.length !== 0) {
            closestStonePosition = stonePositions[0];
            for (let i = 1; i < stonePositions.length; ++i) {
                if (this._rinkInfo.targetCenter.clone().sub(stonePositions[i]).length() <
                    closestStonePosition.length()) {
                    closestStonePosition = stonePositions[i];
                }
            }
        } else {
            closestStonePosition = null;
        }
        return closestStonePosition;
    }

    private determineShotParameters(destinationPosition: Vector3, minPower: number, maxPower: number): ShotParameters {
        let shotPower = RandomHelper.getNumberInRangeIncluded(minPower, maxPower);
        let spin = RandomHelper.getIntegerNumberInRange(0, 1);
        let spinModifier = spin === StoneSpin.Clockwise ? 1 : -1;
        let adjustmentAngle = ComputerAI.DIRECTION_ADJUSTMENT * spinModifier *
            this._rotationDisplacementAngle / shotPower;
        let adjustmentMatrix = new Matrix3().set(
            Math.cos(adjustmentAngle), 0, Math.sin(adjustmentAngle),
            0, 1, 0,
            -Math.sin(adjustmentAngle), 0, Math.cos(adjustmentAngle));
        let direction = new Vector3(0, 0, 1);
        direction.applyMatrix3(adjustmentMatrix);
        return { spin: spin, direction: direction, power: shotPower };
    }
}
