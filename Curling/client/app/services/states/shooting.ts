import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "../game-handler/game-info.interface";
import { LoadingStone } from "./loading-stone";
import { EndSet } from "./end-set";

export class Shooting extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    /**
     * Initialize the unique Shooting state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameInfo: IGameInfo, doInitialization = false): void {
        Shooting._instance = new Shooting(gameInfo, doInitialization);
    }

    /**
     * Get the instance of the state Shooting. This state is used while the stones are moving.
     * @returns The Shooting state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return Shooting._instance;
    }

    private constructor(gameInfo: IGameInfo, doInitialization = false) {
        super(gameInfo, doInitialization);
    }

    protected performEnteringState(): void {
        this._gameInfo.stoneHandler.performShot(
            this._gameInfo.direction,
            this._gameInfo.speed,
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
        this._gameInfo.stoneHandler.removeOutOfBoundsStones(this._gameInfo.scene);
        this._gameInfo.gameStatus.nextPlayer();
        this._gameInfo.cameraService.replacePCameraToInitialPosition();
    }

    //Nothing to do while in shooting state. We wait until the stoneHandler finishes the movement of the stones.

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
