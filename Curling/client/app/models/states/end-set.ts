import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { LoadingStone } from "./loading-stone";
import { EndGame } from "./end-game";
import { CurrentPlayer } from "../../models/current-player";

export class EndSet extends AbstractGameState {

    private static readonly NUMBER_OF_SETS_TO_PLAY = 3;

    private static _instance: AbstractGameState = null;

    /**
     * Initialize the unique EndSet state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameInfo: IGameInfo, doInitialization = false): void {
        EndSet._instance = new EndSet(gameInfo, doInitialization);
    }

    /**
     * Get the instance of the state EndSet. This state is used while the set is finished.
     * @returns The EndSet state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return EndSet._instance;
    }

    private constructor(gameInfo: IGameInfo, doInitialization = false) {
        super(gameInfo, doInitialization);
    }

    protected performEnteringState() {
        let points = this._gameInfo.stoneHandler.countPoints();
        this._gameInfo.gameStatus.incrementScorePlayer(points.player);
        this._gameInfo.gameStatus.incrementScoreComputer(points.computer);
        let newState: AbstractGameState;
        if (this._gameInfo.gameStatus.currentSet < EndSet.NUMBER_OF_SETS_TO_PLAY) {
            this._gameInfo.gameStatus.currentSet += 1;
            this._gameInfo.gameStatus.resetStones();
            this._gameInfo.stoneHandler.cleanAllStones(this._gameInfo.scene);
            if (points.player > points.computer) {
                this._gameInfo.gameStatus.currentPlayer = CurrentPlayer.BLUE;
            }
            else if (points.player < points.computer) {
                this._gameInfo.gameStatus.currentPlayer = CurrentPlayer.RED;
            }
            newState = LoadingStone.getInstance();
        }
        else {
            newState = EndGame.getInstance();
        }
        this.leaveState(newState);
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
