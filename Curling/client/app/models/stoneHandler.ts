import { ObjectLoader } from "three";
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

    constructor(objectLoader: ObjectLoader, rinkInfo: RinkInfo, firstPlayer: StoneColor) {
        this._rinkInfo = rinkInfo;
        this._currentPlayer = firstPlayer - 1;
        this._objectLoader = objectLoader;
        this._stoneOnTheGame = new Array<Stone>();
    }

    public performShot(callbackWhenShotFinished: Function) {
        //TODO: Launch the last stone in the array of stones.
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

    public update() {
        //TODO: Perform the verification of collisions here and hanble the displacement of the stones.
    }
}
