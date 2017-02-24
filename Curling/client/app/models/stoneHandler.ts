import { Clock, ObjectLoader, Vector3 } from "three";
import { RinkInfo } from "./rinkInfo.interface";
import { Stone, StoneColor, StoneSpin } from "./stone";
import { GameComponent } from "./gameComponent.interface";
import { CameraType } from "./../services/render.service";

export interface Points {
    player: number;
    computer: number;
}

export class StoneHandler implements GameComponent {

    public static readonly SHOT_POWER_MINIMUM = 0.2;
    public static readonly SHOT_POWER_MAXIMUM = 4;
    public static readonly SHOT_POWER_OFFSET = 1;

    public static readonly COLLISION_SPEED_KEEP_PERCENT = 0.85;
    public static readonly COLLISION_SPEED_TRANSFERED_PERCENT = 0.85;

    public static readonly SHOT_ANGLE_MINIMUM = -2.25;
    public static readonly SHOT_ANGLE_MAXIMUM = 2.25;

    private _rinkInfo: RinkInfo;
    private _currentPlayer: StoneColor;
    private _objectLoader: ObjectLoader;
    private _stoneOnTheGame: Stone[];
    private _powerTimer: Clock;
    private _power: number;
    private _currentSpin: StoneSpin;
    private _mouseIsPressed: boolean;
    private _mousePositionPlaneXZ: Vector3;
    private _callbackAfterShotFinished: Function;

    constructor(objectLoader: ObjectLoader, rinkInfo: RinkInfo, firstPlayer: StoneColor) {
        this._rinkInfo = rinkInfo;
        this._currentPlayer = firstPlayer - 1;
        this._objectLoader = objectLoader;
        this._stoneOnTheGame = new Array<Stone>();
        this._power = 0;
        this._powerTimer = new THREE.Clock();
        this._currentSpin = StoneSpin.Clockwise;
        this._mouseIsPressed = false;
        this._mousePositionPlaneXZ = new Vector3(0, 0, 0);
        this._callbackAfterShotFinished = null;
    }

    public get stoneOnTheGame(): Stone[] {
        return this._stoneOnTheGame;
    }

    public get power(): number {
        return this._power || 0;
    }

    public get currentSpin(): StoneSpin {
        return this._currentSpin;
    }


    public get mousePositionPlaneXZ(): Vector3 {
        return this._mousePositionPlaneXZ;
    }

    public get mouseIsPressed() : boolean {
        return this._mouseIsPressed;
    }

    public set mouseIsPressed(v : boolean) {
        this._mouseIsPressed = v;
    }

    public invertSpin() {
        this._currentSpin = (this.currentSpin === StoneSpin.Clockwise)
            ? StoneSpin.CounterClockwise : StoneSpin.Clockwise;
    }

    public calculateMousePosition(event: MouseEvent, currentCam: CameraType) {
        if (currentCam === CameraType.PERSPECTIVE_CAM) {
            this._mousePositionPlaneXZ.set(
                -(event.clientX / window.innerWidth) / 0.02215 + 22.55, // Numbers to align with the rink model
                0,
                (event.clientY / window.innerHeight) / 0.008 + 46.75 // Numbers to align with the rink model
            );
        } else if (currentCam === CameraType.ORTHOGRAPHIC_CAM) {
            this._mousePositionPlaneXZ.set(
                -(event.clientY / window.innerHeight) / 0.038 + 13.2 ,
                0,
                 (event.clientX / window.innerWidth) / 0.0268 - 18.6
            );
        } else {
            console.error("calculateMousePosition : camera unrecognized");
        }
        // Clamp to angle range
        // Under
        if (this.mousePositionPlaneXZ.x < StoneHandler.SHOT_ANGLE_MINIMUM) {
            this.mousePositionPlaneXZ.x = StoneHandler.SHOT_ANGLE_MINIMUM;
        }
        // Over
        if (this.mousePositionPlaneXZ.x > StoneHandler.SHOT_ANGLE_MAXIMUM) {
            this.mousePositionPlaneXZ.x = StoneHandler.SHOT_ANGLE_MAXIMUM;
        }
    }

    public startPower() {
        this._powerTimer = new THREE.Clock();
        this._powerTimer.start();
    }

    public performShot(
        direction: Vector3,
        callbackWhenShotFinished: Function = () => {/*Do nothing by default*/}
        ) {
            if (this._stoneOnTheGame.length === 0) {
                throw new RangeError("Cannot perform shot on a stone. No stones has been generated yet.");
            }

            this._powerTimer.stop();
            let timeDelta = this._powerTimer.getElapsedTime();
            if (timeDelta > StoneHandler.SHOT_POWER_MINIMUM) {
                let lastIndex = this._stoneOnTheGame.length - 1;
                this._stoneOnTheGame[lastIndex].speed =
                    (timeDelta > StoneHandler.SHOT_POWER_MAXIMUM)
                        ? StoneHandler.SHOT_POWER_MAXIMUM + StoneHandler.SHOT_POWER_OFFSET
                            : timeDelta + StoneHandler.SHOT_POWER_OFFSET;

                this._stoneOnTheGame[lastIndex].direction = direction;
                this._stoneOnTheGame[lastIndex].spin = this.currentSpin;
                this._callbackAfterShotFinished = callbackWhenShotFinished;
            } else {
                this._powerTimer.stop();
                throw new RangeError("Not enough power.");
            }
    }

    public generateNewStone(): Promise<Stone> {
        this._currentPlayer = (this._currentPlayer + 1) % StoneColor.NumberOfColors;
        return Stone.createStone(this._objectLoader, this._currentPlayer, this._rinkInfo.initialStonePosition)
            .then((stone: Stone) => {
                this._stoneOnTheGame.push(stone);
                return stone;
            });
    }

    //TODO: Count the points by looking at the RinkInfo and the position of the array of stones.
    // public countPoints(): Points {
    //     return null;
    // }

    public cleanAllStones() {
        this._stoneOnTheGame.splice(0, this._stoneOnTheGame.length);
    }

    public update(timePerFrame: number) {
        if (this._mouseIsPressed) {
            this._power = Math.min(this._powerTimer.getElapsedTime() / StoneHandler.SHOT_POWER_MAXIMUM * 100, 100);
        } else {
            this._power = 0;
        }
        if (this._callbackAfterShotFinished !== null) {
            let aStoneIsMoving = false;
            let isCollision = false;
            this._stoneOnTheGame.map((stone: Stone, stoneNumber: number, allTheStones: Stone[]) => {
                if (stone.speed !== 0) {
                    stone.update(timePerFrame);
                    this.resolveCollisions(stone);
                    isCollision = true;
                }
                aStoneIsMoving = aStoneIsMoving || stone.speed !== 0;
            });
            if (!aStoneIsMoving && !isCollision) {
                this._callbackAfterShotFinished();
                this._callbackAfterShotFinished = null;
            }
        }
    }

    private resolveCollisions(stoneToVerify: Stone) {
        let stonesHit = new Array<Stone>();
        this._stoneOnTheGame.map((stone: Stone, stoneNumber: number, allTheStones: Stone[]) => {
            if (stoneToVerify !== stone) {
                if (stoneToVerify.boundingSphere.intersectsSphere(stone.boundingSphere)) {
                    stonesHit.push(stone);
                }
            }
        });
        if (stonesHit.length !== 0) {
            this.changeSpeedAndDirectionOfStones(stonesHit, stoneToVerify);
        }
    }

    private changeSpeedAndDirectionOfStones(stonesHit: Array<Stone>, stoneHiting: Stone) {
        // Collided with one stone
        if (stonesHit.length === 1) {

            let stoneToStoneVector: Vector3 = stonesHit[0].position.clone().sub(stoneHiting.position).normalize();

            let newDirection: Vector3 = stonesHit[0].direction.clone().multiplyScalar(stonesHit[0].speed)
                .add(stoneHiting.direction.clone().multiplyScalar(stoneHiting.speed)
                .add(stoneToStoneVector))
                .normalize();

            let totalSpeed = stonesHit[0].speed + stoneHiting.speed;

            stonesHit[0].speed = totalSpeed * StoneHandler.COLLISION_SPEED_TRANSFERED_PERCENT
                * (newDirection.clone().dot(stoneToStoneVector) / newDirection.length());
            stonesHit[0].direction = newDirection;

            stoneHiting.speed = totalSpeed * StoneHandler.COLLISION_SPEED_KEEP_PERCENT
                * (1 - newDirection.clone().dot(stoneToStoneVector) / newDirection.length());
            stoneHiting.direction = newDirection.clone()
                .applyAxisAngle(stoneToStoneVector.cross(new Vector3(0, 1, 0)), -Math.PI);

        } else if (stonesHit.length > 1) { // Collided with more than one stone

            let symmetryAxisVector: Vector3 = new Vector3(0, 0, 0);
            let totalSpeed: number = stoneHiting.speed;
            stonesHit.map((stone: Stone, stoneNumber: number, allTheStone: Stone[]) => {
                symmetryAxisVector.add(stone.direction);
                totalSpeed += stone.speed;
            });
            symmetryAxisVector.normalize();

            stoneHiting.revertToLastPosition(); // Revert position to prevent the stone to be stucked
            stoneHiting.direction = symmetryAxisVector;
            stoneHiting.speed = totalSpeed * (1 - StoneHandler.COLLISION_SPEED_KEEP_PERCENT) / stonesHit.length;

            stonesHit.map((stone: Stone, stoneNumber: number, allTheStone: Stone[]) => {
                stone.speed = totalSpeed / (stonesHit.length) * StoneHandler.COLLISION_SPEED_TRANSFERED_PERCENT;
                stone.direction = stone.position.clone().sub(stoneHiting.position).normalize();
            });
        } else {
            console.error("changeSpeedAndDirectionOfStones : stonesHit array empty or invalid...");
        }
    }
}
