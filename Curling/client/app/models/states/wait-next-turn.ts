import { AbstractGameState } from "./abstract-game-state";
import { LoadingStone } from "./loading-stone";
import { EndSet } from "./end-set";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { IAngularInfo } from "../../services/game-handler/angular-info.interface";

export class WaitNextTurn extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    private _angularInfo: IAngularInfo;

    /**
     * Initialize the unique PlayerTurn state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        WaitNextTurn._instance = new WaitNextTurn(gameServices, gameInfo, angularInfo);
    }

    public static getInstance(): AbstractGameState {
        return WaitNextTurn._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        super(gameServices, gameInfo);
        this._angularInfo = angularInfo;
    }

    protected performEnteringState() {
        this._gameServices.cameraService.movePCameraEndRink();
        if (this._gameInfo.gameStatus.currentStonesPlayer === 0
            && this._gameInfo.gameStatus.currentStonesComputer === 0) {
                this.leaveState(EndSet.getInstance());
            } else {
                this._angularInfo.showText = true;
            }
    }

    protected performMouseMove(): AbstractGameState {
        return null;
    }

    protected performMouseButtonPress(): AbstractGameState {
        return null;
    }

    protected performMouseButtonReleased(): AbstractGameState {
        this._angularInfo.showText = false;
        return LoadingStone.getInstance();
    }
}
