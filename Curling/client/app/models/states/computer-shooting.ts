import { AbstractGameState } from "./abstract-game-state";
import { LoadingStone } from "./loading-stone";
import { EndSet } from "./end-set";
import { IGameState } from "../../models/game-state.interface";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

export class ComputerShooting extends AbstractGameState {

    private static _instance: AbstractGameState = null;
    private static readonly UPDATE_NAME = "ComputerShooting";
    /**
     * Initialize the unique PlayerShooting state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        ComputerShooting._instance = new ComputerShooting(gameServices, gameInfo);
    }

    /**
     * Get the instance of the state PlayerShooting. This state is used while the stones are moving.
     * @returns The PlayerShooting state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return ComputerShooting._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

    protected performEnteringState() {
        this._gameServices.stoneHandler.performShot(
            AbstractGameState.shotParameters,
            () => {
                this._gameInfo.gameStatus.usedStone();
                let newState: AbstractGameState;
                if (this._gameInfo.gameStatus.currentStonesPlayer === 0
                    && this._gameInfo.gameStatus.currentStonesComputer === 0) {
                    newState = EndSet.getInstance();
                }
                else {
                    newState = LoadingStone.getInstance();
                }
                this.leaveState(newState);
            });
    }

    protected performLeavingState() {
        this._gameServices.stoneHandler.removeOutOfBoundsStones();
        this._gameInfo.gameStatus.nextPlayer();
        this._gameServices.cameraService.replacePCameraToInitialPosition();
    }

    protected performMouseMove(event: MouseEvent): AbstractGameState {
        //Do nothing
        return null;
    }

    protected performMouseButtonPress(): AbstractGameState {
        //Do nothing
        return null;
    }

    protected performMouseButtonReleased(): AbstractGameState {
        //Do nothing
        return null;
    }

    public update(timePerFrame: number) {
        //TODO: Implement moving broom by the computer and the sound.
    }
}
