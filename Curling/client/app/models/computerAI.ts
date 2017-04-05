import { Vector3, Matrix3 } from "three";
import { RinkInfo } from "./scenery/rink-info.interface";
import { Difficulty } from "./difficulty";
import { RandomHelper } from "./random-helper";
import { ShotParameters } from "./shot-parameters.interface";
import { PhysicEngine } from "../services/game-physics/physic-engine";

export class ComputerAI {

    //Different ranges following the difficulty enumeration
    //WARNING : If the physic or the arena dimension change, these numbers must change to be able
    //to shot in the center.
    private static readonly INTERVAL_MAX_SHOOT_POWER = [
        { min: 3.9, max: 4.5 },
        { min: 4, max: 4.3 },
        { min: 4.21, max: 4.21 }
    ];
    //This constant is used to adjust the direction when launching the stone in the center. Because it is difficult
    //to calculate the exact speed and direction the stone must take to arrive at a final position, this constant
    //is used instead.
    //WARNING : If the physic changes or the arena dimension changes, this constant must be adjusted.
    private static readonly ANGLE_ADJUSTMENT = Math.PI / 64;
    //These directions are calculated with the ANGLE_ADJUSTMENT constant with the speed reference of 4.21. It means
    //that when the computer wants to shot to the center with the spin clockwise, it takes the first direction.
    //If the computer wants to shot to the center with the spin counter clockwise, it takes the second direction.
    private static readonly directionsToAimInCenter = [
        new Vector3(0, 0, 1).applyAxisAngle(PhysicEngine.Y_AXIS, -ComputerAI.ANGLE_ADJUSTMENT),
        new Vector3(0, 0, 1).applyAxisAngle(PhysicEngine.Y_AXIS, ComputerAI.ANGLE_ADJUSTMENT)
    ]

    private _rinkInfo: RinkInfo;
    private _meanFrictionCoefficients: number;
    private _difficulty: Difficulty;
    private _minShotPower: number;
    private _maxShotPower: number;
    private _physicEngine: PhysicEngine;

    constructor(rinkInfo: RinkInfo, difficulty: Difficulty) {
        this._rinkInfo = rinkInfo;
        this._minShotPower = ComputerAI.INTERVAL_MAX_SHOOT_POWER[difficulty].min;
        this._maxShotPower = ComputerAI.INTERVAL_MAX_SHOOT_POWER[difficulty].max;
        this._physicEngine = new PhysicEngine(rinkInfo.initialStonePosition);
    }

    public determineNextShotParameters(stonePositionToShotOnIt?: Vector3): ShotParameters {
            //Determine random shotPower and spin following the computer difficulty.
            let shotParameters: ShotParameters = {
                spin: RandomHelper.getIntegerNumberInRange(0, 1),
                direction: null,
                power: RandomHelper.getNumberInRangeIncluded(this._minShotPower, this._maxShotPower)
            };

            //Determine the direction.
            if (stonePositionToShotOnIt === undefined) {
                shotParameters.direction = ComputerAI.directionsToAimInCenter[shotParameters.spin].clone();
            } else {
                this._physicEngine.speed = shotParameters.power;
                this._physicEngine.spin = shotParameters.spin;
                shotParameters.direction = this._physicEngine.calculateDirectionToPassAtPosition(stonePositionToShotOnIt);
            }

            return shotParameters;
    }
}
