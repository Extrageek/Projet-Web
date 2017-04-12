import { AbstractGameState } from "./abstract-game-state";
import { CurrentPlayer } from "../../models/current-player";
import { PlayerTurn } from "./player-turn";
import { ComputerTurn } from "./computer-turn";
import { Stone } from "../../models/stone";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

export class LoadingStone extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    private _leavingPromise: Promise<void>;

    /**
     * Initialize the unique LoadingStone state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        LoadingStone._instance = new LoadingStone(gameServices, gameInfo);
    }

    /**
     * Get the instance of the state EndGame. This state is used while the game is finished.
     * @returns The EndGame state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return LoadingStone._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

    /**
     * Load a new stone and change to playerTurn or computerTurn.
     * @param paramFromLastState Change to the playerTurn after the stone finish loading if 0,
     * change to computerTurn otherwise.
     */
    protected performEnteringState() {
        this._gameServices.cameraService.replacePCameraToInitialPosition();
        this._leavingPromise = new Promise<void>((resolve, reject) => {
            this._gameServices.stoneHandler.generateNewStone(this._gameInfo.gameStatus.currentPlayer)
                .then((stone: Stone) => {
                    this._gameServices.cameraService.movePerspectiveCameraToFollowObjectOnZ(stone);

                    let newState: AbstractGameState;
                    if (this._gameInfo.gameStatus.currentPlayer === CurrentPlayer.BLUE) {
                        newState = PlayerTurn.getInstance();
                    }
                    else {
                        newState = ComputerTurn.getInstance();
                    }
                    this.leaveState(newState);
                    resolve();
                });
        });

    }

    protected performLeavingState(): Promise<void> {
        return this._leavingPromise;
    }

    protected performMouseMove(): AbstractGameState {
        return null;
    }

    protected performMouseButtonPress(): AbstractGameState {
        return null;
    }

    protected performMouseButtonReleased(): AbstractGameState {
        return null;
    }
}
