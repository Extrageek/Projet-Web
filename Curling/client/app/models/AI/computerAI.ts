import { Vector3, Matrix3 } from "three";
import { IRinkInfo } from "./../scenery/rink-info.interface";
import { IShotParameters } from "./../shot-parameters.interface";
import { PhysicEngine } from "../../services/game-physics/physic-engine";
import { RandomHelper } from "./../random-helper";

export abstract class ComputerAI {

    //Different ranges following the difficulty enumeration
    //WARNING : If the physic or the arena dimension change, these numbers must change to be able
    //to shot in the center.
    /*
    private static readonly INTERVAL_SHOOT_POWER_CENTER = [
        { min: 4, max: 4.5 },
        { min: 4, max: 4.3 },
        { min: 4.21, max: 4.21 }
    ];

    private static readonly INTERVAL_SHOT_POWER_PUSH = [
        { min: 5, max: 5.5},
        { min: 5.2, max: 5.8},
        { min: 5.8, max: 5.8}
    ];

    private static readonly INTERVAL_DIRECTION = [
        { min: -0.01, max: 0.01 },
        { min: -0.008, max: 0.008 },
        { min: 0, max: 0}
    ];
    */

    //This constant is used to adjust the direction when launching the stone in the center. Because it is difficult
    //to calculate the exact speed and direction the stone must take to arrive at a final position, this constant
    //is used instead.
    //WARNING : If the physic changes or the arena dimension changes, this constant must be adjusted.
    private static readonly ANGLE_ADJUSTMENT = Math.PI / 64;
    //These directions are calculated with the ANGLE_ADJUSTMENT constant with the speed reference of 4.21. It means
    //that when the computer wants to shot to the center with the spin clockwise, it takes the first direction.
    //If the computer wants to shot to the center with the spin counter clockwise, it takes the second direction.
    protected static readonly directionsToAimInCenter = [
        new Vector3(0, 0, 1).applyAxisAngle(PhysicEngine.Y_AXIS, -ComputerAI.ANGLE_ADJUSTMENT),
        new Vector3(0, 0, 1).applyAxisAngle(PhysicEngine.Y_AXIS, ComputerAI.ANGLE_ADJUSTMENT)
    ];

    protected _rinkInfo: IRinkInfo;
    protected _physicEngine: PhysicEngine;

    constructor(rinkInfo: IRinkInfo) {
        this._rinkInfo = rinkInfo;
        this._physicEngine = new PhysicEngine(rinkInfo.initialStonePosition);
    }

    public determineShotParametersOnStone(stonePositionToShotOnIt: Vector3): IShotParameters {
        if (stonePositionToShotOnIt === undefined || stonePositionToShotOnIt === null) {
            throw new Error("The stone position to shot on it cannot be null");
        }
        return this.shotParametersOnStone(stonePositionToShotOnIt);
    }

    protected abstract shotParametersOnStone(stonePositionToShotOnIt: Vector3): IShotParameters;

    public abstract determineShotParametersOnCenter(): IShotParameters;

    protected applyDirectionModification(direction: Vector3, angleToApply: number): Vector3 {
        console.log(angleToApply);
        return direction.applyAxisAngle(PhysicEngine.Y_AXIS, angleToApply);
    }
}
