import { Object3D, ObjectLoader, PerspectiveCamera, Vector2, Vector3 } from "three";
import { RinkInfo } from "./rinkInfo.interface";
import { Stone, StoneColor } from "./stone";
import { GameComponent } from "./gameComponent.interface";
import { CameraType } from "./../services/render.service";

export interface Points {
    player: number;
    computer: number;
}

export class StoneHandler implements GameComponent {

    private static readonly COLLISION_SPEED_KEEP_PERCENT = 0.85;
    private static readonly COLLISION_SPEED_TRANSFERED_PERCENT = 0.85;

    private _rinkInfo: RinkInfo;
    private _currentPlayer: StoneColor;
    private _objectLoader: ObjectLoader;
    private _stoneOnTheGame: Stone[];
    private _mousePositionPlaneXZ: Vector3;
    private _raycaster = new THREE.Raycaster();
    private _callbackAfterShotFinished: Function;

    constructor(objectLoader: ObjectLoader, rinkInfo: RinkInfo, firstPlayer: StoneColor) {
        this._rinkInfo = rinkInfo;
        this._currentPlayer = firstPlayer - 1;
        this._objectLoader = objectLoader;
        this._stoneOnTheGame = new Array<Stone>();
        this._mousePositionPlaneXZ = new Vector3();
        this._callbackAfterShotFinished = null;
    }

    public calculateMousePosition(event: MouseEvent, currentCam: CameraType) {
        if(currentCam === CameraType.PERSPECTIVE_CAM) {
            this._mousePositionPlaneXZ.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                0,
                -(event.clientY / window.innerHeight) *  6.17 + 3.21
            );
            // console.log(this._mousePositionPlaneXZ, -(event.clientY / window.innerHeight));
        } else if(currentCam === CameraType.ORTHOGRAPHIC_CAM) {
            this._mousePositionPlaneXZ.set(
                (event.clientX / window.innerWidth) * 2 - 0.36,
                0,
                -(event.clientY / window.innerHeight) *  2  + 1  
            );
            // console.log(this._mousePositionPlaneXZ);       
        } else {
            console.error("calculateMousePosition : camera unrecognized");
        }
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
                    //console.log(stone);
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
