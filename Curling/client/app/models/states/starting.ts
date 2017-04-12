import { AbstractGameState } from "./abstract-game-state";
import { LoadingStone } from "./loading-stone";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { IGameInfo } from "../../services/game-handler/game-info.interface";

export class Starting extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    /**
     * Initialize the unique Starting state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        Starting._instance = new Starting(gameServices, gameInfo);
    }

    /**
     * Get the instance of the state Starting. This state is used only at the beginning to set the different services.
     * @returns The Starting state or null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return Starting._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

     protected performEnteringState(): void {
        console.log("reset parameters");
        this._gameServices.cameraService.stopPerspectiveCameraToFollowObjectOnZ();
        this._gameServices.cameraService.replacePCameraToInitialPosition();
        this._gameServices.cameraService.setPerspectiveCameraCurrent();
        this._gameServices.particlesService.removeParticulesFromScene();
        this._gameServices.stoneHandler.cleanAllStones();
        this._gameInfo.gameStatus.resetGameStatus();
        this._gameInfo.gameStatus.randomFirstPlayer();
        this.leaveState(LoadingStone.getInstance());
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
