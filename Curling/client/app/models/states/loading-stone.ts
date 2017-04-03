import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { Stone } from "../../models/stone";
import { CurrentPlayer } from "../../models/current-player";
import { PlayerTurn } from "./player-turn";
import { ComputerTurn } from "./computer-turn";

export class LoadingStone extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    /**
     * Initialize the unique LoadingStone state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameInfo: IGameInfo, doInitialization = false) {
        LoadingStone._instance = new LoadingStone(gameInfo, doInitialization);
    }

    /**
     * Get the instance of the state EndGame. This state is used while the game is finished.
     * @returns The EndGame state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return LoadingStone._instance;
    }

    private constructor(gameInfo: IGameInfo, doInitialization = false) {
        super(gameInfo, doInitialization);
    }

    /**
     * Load a new stone and change to playerTurn or computerTurn.
     * @param paramFromLastState Change to the playerTurn after the stone finish loading if 0,
     * change to computerTurn otherwise.
     */
    protected performEnteringState() {
        this._gameInfo.stoneHandler.generateNewStone(this._gameInfo.gameStatus.currentPlayer)
            .then((stone: Stone) => {
                this._gameInfo.scene.add(stone);
                this._gameInfo.cameraService.movePerspectiveCameraToFollowObjectOnZ(stone);

                let newState: AbstractGameState;
                if (this._gameInfo.gameStatus.currentPlayer === CurrentPlayer.BLUE) {
                    newState = PlayerTurn.getInstance();
                }
                else {
                    newState = ComputerTurn.getInstance();
                }
                this.leaveState(newState);
            });
    }

    protected performLeavingState() {
        //Nothing to do
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
