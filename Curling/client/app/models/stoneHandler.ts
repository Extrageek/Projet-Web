import { ObjectLoader, Vector3 } from "three";
import { RinkInfo } from "./rinkInfo.interface";
import { Stone, StoneColor } from "./stone";
import { GameComponent } from "./gameComponent.interface";

export interface Points {
    player: number;
    computer: number;
}

export class StoneHandler implements GameComponent {

    private static readonly COLLISION_SPEED_KEEP_PERCENT = 0.25;
    private static readonly COLLISION_SPEED_TRANSFERED_PERCENT = 0.65;

    private _rinkInfo: RinkInfo;
    private _currentPlayer: StoneColor;
    private _objectLoader: ObjectLoader;
    private _stoneOnTheGame: Stone[];
    private _callbackAfterShotFinished: Function;

    constructor(objectLoader: ObjectLoader, rinkInfo: RinkInfo, firstPlayer: StoneColor) {
        this._rinkInfo = rinkInfo;
        this._currentPlayer = firstPlayer - 1;
        this._objectLoader = objectLoader;
        this._stoneOnTheGame = new Array<Stone>();
        this._callbackAfterShotFinished = null;
    }

    public performShot(speed: number, direction: Vector3,
        callbackWhenShotFinished: Function = () => {/*Do nothing by default*/}) {
        //TODO: Launch the last stone in the array of stones.
        if (this._stoneOnTheGame.length === 0) {
            throw new Error("Cannot perform shot on a stone. No stones has been generated yet.");
        }
        let lastIndex = this._stoneOnTheGame.length - 1;
        this._stoneOnTheGame[lastIndex].speed = speed;
        this._stoneOnTheGame[lastIndex].direction = direction;
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

    public countPoints(): Points {
        //TODO: Count the points by looking at the RinkInfo and the position of the array of stones.
        return null;
    }

    public cleanAllStones() {
        this._stoneOnTheGame.splice(0, this._stoneOnTheGame.length);
    }

    public update(timePerFrame: number) {
        //TODO: Perform the verification of collisions here and hanble the displacement of the stones.
        if (this._callbackAfterShotFinished !== null) {
            let aStoneIsMoving = false;
            this._stoneOnTheGame.map((stone: Stone, stoneNumber: number, allTheStones: Stone[]) => {
                if (stone.speed !== 0) {
                    stone.update(timePerFrame);
                    this.resolveCollisions(stone);
                }
                
                aStoneIsMoving = aStoneIsMoving || stone.speed !== 0;
            });
            if (!aStoneIsMoving) {
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
            stoneToVerify.revertToLastPosition();
        }
    }

    private changeSpeedAndDirectionOfStones(stonesHit: Array<Stone>, stoneHiting: Stone) {
        let newStonesDirection = this.setNewDirections(stonesHit, stoneHiting);
        //let totalAngle = this.calculateTotalAngleOfCollision(newStonesDirection);
        //console.log(totalAngle);
        let totalSpeed = this.calculateTotalSpeed(stonesHit, stoneHiting);
        let speedTransmitedToOtherStones = totalSpeed * StoneHandler.COLLISION_SPEED_TRANSFERED_PERCENT;
        this.setNewCollidedStonesSpeeds(stonesHit, stoneHiting.direction, speedTransmitedToOtherStones);

        //The direction vectors of collided stones are inverted, added together and the result is normalized.
        let speed = 0;
        stoneHiting.direction = newStonesDirection.reduce((previousValue: Vector3, currentValue: Vector3,
            currentIndex: number, array: Vector3[]) => {
                let directionSignToApply = Math.sign(stoneHiting.position.x - currentValue.x);
                let angle = currentValue.angleTo(stoneHiting.direction)
                if (angle !== 0) {
                    speed += currentValue.angleTo(stoneHiting.direction) / (Math.PI/2) * stoneHiting.speed;
                }
                else {
                    speed += 0.001;
                }
                console.log(currentValue.angleTo(stoneHiting.direction));
                console.log(stoneHiting.speed);
                currentValue.projectOnVector(stoneHiting.direction.clone());
                let partOfParallelPosition = stoneHiting.direction.clone();
                partOfParallelPosition.sub(currentValue);
                let x = partOfParallelPosition.x;
                let z = partOfParallelPosition.z * directionSignToApply;
                partOfParallelPosition.setZ(x);
                partOfParallelPosition.setX(z);
                console.log(partOfParallelPosition);
                currentValue.add(partOfParallelPosition).normalize();
            return previousValue.add(currentValue).normalize();
        }, new Vector3(0, 0, 0)).normalize();
        stoneHiting.speed = speed / stonesHit.length;
        console.log(stoneHiting.speed);
        //stoneHiting.speed = totalSpeed * StoneHandler.COLLISION_SPEED_KEEP_PERCENT;
    }

    private setNewDirections(stonesHit: Array<Stone>, stoneHiting: Stone): Array<Vector3> {
        let newStonesDirection = new Array<Vector3>();
        stonesHit.map((stone: Stone, index: number, array: Stone[]) => {
            stone.direction = stone.position.clone().sub(stoneHiting.position).normalize();
            //console.log(stone.direction);
            newStonesDirection.push(stone.direction.clone());
        });
        return newStonesDirection;
    }

    private calculateTotalAngleOfCollision(newStonesDirection: Array<Vector3>): number {
        let totalAngle = 0;
        for (let i = 1; i < newStonesDirection.length; ++i) {
            totalAngle += newStonesDirection[i - 1].angleTo(newStonesDirection[i]);
        }
        return totalAngle;
    }

    private calculateTotalSpeed(stonesHit: Array<Stone>, stoneHiting: Stone): number {
        let totalSpeed = stoneHiting.speed;
        for (let i = 0; i < stonesHit.length; ++i) {
            totalSpeed += stonesHit[i].speed;
        }
        return totalSpeed;
    }

    private setNewCollidedStonesSpeeds(stonesHit: Array<Stone>, stoneHitingDirection: Vector3,
        speedTransmitedToOtherStones: number) {
        stonesHit.map((stone: Stone, index: number, array: Stone[]) => {
            let angleBetweenStonesCollide = stone.direction.angleTo(stoneHitingDirection);
            stone.speed = speedTransmitedToOtherStones -
                angleBetweenStonesCollide / (Math.PI/2) * speedTransmitedToOtherStones;
            //console.log(stone.speed);
        });
    }
}
