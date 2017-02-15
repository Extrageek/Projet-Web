import { ObjectLoader, Vector3 } from "three";
import { RinkInfo } from "./rinkInfo.interface";
import { Stone, StoneColor } from "./stone";
import { GameComponent } from "./gameComponent.interface";

export interface Points {
    player: number;
    computer: number;
}

export class StoneHandler implements GameComponent {

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
        let aStoneIsMoving = false;
        this._stoneOnTheGame.map((stone: Stone, stoneNumber: number, allTheStones: Stone[]) => {
            stone.update(timePerFrame);
            aStoneIsMoving = aStoneIsMoving || stone.speed !== 0;
        });
        if (!aStoneIsMoving && this._callbackAfterShotFinished !== null) {
            this._callbackAfterShotFinished();
            this._callbackAfterShotFinished = null;
        }
    }
}
