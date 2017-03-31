import { ObjectLoader, Vector3, Box3, Scene } from 'three';
import { RinkInfo } from '../../models/scenery/rink-info.interface';
import { Stone, StoneColor } from '../../models/stone';
import { GameComponent } from '../../models/game-component.interface';
import { ShotParameters } from "../../models/shot-parameters.interface";

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

    private _rinkInfo: RinkInfo;
    private _currentPlayer: StoneColor;
    private _objectLoader: ObjectLoader;
    private _stoneOnTheGame: Stone[];
    private _stonesToBeRemoved: Stone[];
    private _callbackAfterShotFinished: Function;
    private _outOfBoundsRink: Box3;
    private _boxBetweenLines: Box3;
    private _invalidAreaForStonesToBeIn : Box3;

    constructor(objectLoader: ObjectLoader, rinkInfo: RinkInfo, firstPlayer: StoneColor) {
        this._rinkInfo = rinkInfo;
        this._currentPlayer = firstPlayer - 1;
        this._objectLoader = objectLoader;
        this._stoneOnTheGame = new Array<Stone>();
        this._stonesToBeRemoved = new Array<Stone>();
        this._callbackAfterShotFinished = null;
        this._outOfBoundsRink = new Box3(new Vector3(-2.15, 0, -22.5), new Vector3(2.15, 0, 22.5));

        this._boxBetweenLines = new Box3(new Vector3(-2.15, 0, -14.75), new Vector3(2.15, 0, 14.75));
        this._boxBetweenLines.translate(new Vector3(0, 0, 2.95));

        this._invalidAreaForStonesToBeIn = new Box3(new Vector3(-2.15, 0, -17.75), new Vector3(2.15, 0, 17.75));
        this._invalidAreaForStonesToBeIn.translate(new Vector3(0, 0, -7.15));

    }

    public get stoneOnTheGame(): Stone[] {
        return this._stoneOnTheGame;
    }

    public removeOutOfBoundsStones(scene: Scene) {
        for (let stone of this._stonesToBeRemoved) {
            scene.remove(stone);
        }
    }

    public performShot(
        shotParameters: ShotParameters,
        callbackWhenShotFinished: Function = () => {/*Do nothing by default*/ }
    ) {
        if (this._stoneOnTheGame.length === 0) {
            throw new RangeError("Cannot perform shot on a stone. No stones has been generated yet.");
        }
        let lastIndex = this._stoneOnTheGame.length - 1;
        this._stoneOnTheGame[lastIndex].speed = shotParameters.power;
        this._stoneOnTheGame[lastIndex].direction = shotParameters.direction.clone();
        this._stoneOnTheGame[lastIndex].spin = shotParameters.spin;
        this._callbackAfterShotFinished = callbackWhenShotFinished;
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
    public countPoints(): Points {
        return { player: 0, computer: 0 };
    }

    public cleanAllStones(scene: Scene) {
        this._stoneOnTheGame.forEach((stone: Stone) => {
            scene.remove(stone);
        });
        this._stoneOnTheGame.splice(0, this._stoneOnTheGame.length);
    }

    public update(timePerFrame: number) {
        if (this._callbackAfterShotFinished !== null) {
            let aStoneIsMoving = false;
            let isCollision = false;
            this._stoneOnTheGame.map((stone: Stone) => {
                if (stone.speed !== 0) {
                    stone.update(timePerFrame);
                    this.resolveCollisions(stone);
                    isCollision = true;
                } else if (stone.speed === 0) {
                    this.removeInvalidStonesFromRink(stone);
                }
                aStoneIsMoving = aStoneIsMoving || stone.speed !== 0;
            });
            this.verifyOutOfBounds();
            if (!aStoneIsMoving && !isCollision) {
                this._callbackAfterShotFinished();
                this._callbackAfterShotFinished = null;
            }
        }
    }

    public checkPassHogLine() : Boolean {
        let lastIndex = this._stoneOnTheGame.length - 1;
        if (typeof this._stoneOnTheGame[lastIndex] === "undefined") {
            return false;
        } else{
            return !(this._boxBetweenLines.intersectsSphere(this._stoneOnTheGame[lastIndex].boundingSphere));
        }
    }

    private removeStone(stone: Stone) {
        let index = this._stoneOnTheGame.indexOf(stone);
        if (index > -1) {
            this._stoneOnTheGame.splice(index, 1);
        }
    }

    private verifyOutOfBounds() {
        this._stoneOnTheGame.map((stone: Stone) => {
            if (!(this._outOfBoundsRink.intersectsSphere(stone.boundingSphere))) {
                this.removeStone(stone);
                stone.changeStoneOpacity().subscribe(() => {
                    this._stonesToBeRemoved.push(stone);
                });
            }
        });
    }
    private removeInvalidStonesFromRink(stone: Stone) {
        if ((this._invalidAreaForStonesToBeIn.intersectsSphere(stone.boundingSphere))) {
            this.removeStone(stone);
            stone.changeStoneOpacity().subscribe(() => {
                this._stonesToBeRemoved.push(stone);
            });
        }
    }
    private resolveCollisions(stoneToVerify: Stone) {
        let stonesHit = new Array<Stone>();
        this._stoneOnTheGame.map((stone: Stone) => {
            if (stoneToVerify !== stone) {
                if (stoneToVerify.boundingSphere.intersectsSphere(stone.boundingSphere)) {
                    let sound = document.getElementById("collisions");
                    (<HTMLAudioElement>sound).play();
                    stonesHit.push(stone);
                }
            }
        });
        if (stonesHit.length !== 0) {
            this.changeSpeedAndDirectionOfStones(stonesHit, stoneToVerify);
        }
    }

    private changeSpeedAndDirectionOfStones(stonesHit: Array<Stone>, stoneHiting: Stone) {
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
            stonesHit.map((stone: Stone) => {
                symmetryAxisVector.add(stone.direction);
                totalSpeed += stone.speed;
            });
            symmetryAxisVector.normalize();

            stoneHiting.revertToLastPosition(); // Revert position to prevent the stone to be stucked
            stoneHiting.direction = symmetryAxisVector;
            stoneHiting.speed = totalSpeed * (1 - StoneHandler.COLLISION_SPEED_KEEP_PERCENT) / stonesHit.length;

            stonesHit.map((stone: Stone) => {
                stone.speed = totalSpeed / (stonesHit.length) * StoneHandler.COLLISION_SPEED_TRANSFERED_PERCENT;
                stone.direction = stone.position.clone().sub(stoneHiting.position).normalize();
            });
        } else {
            console.error("changeSpeedAndDirectionOfStones : stonesHit array empty or invalid...");
        }
    }
}
