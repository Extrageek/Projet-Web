import { AbstractGameState } from "./abstract-game-state";
import { LoadingStone } from "./loading-stone";
import { EndGame } from "./end-game";
import { CurrentPlayer } from "../../models/current-player";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

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
    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo): void {
        EndSet._instance = new EndSet(gameServices, gameInfo);
    }

    /**
     * Get the instance of the state EndSet. This state is used while the set is finished.
     * @returns The EndSet state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return EndSet._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

    protected performEnteringState() {
        let points = this._gameServices.stoneHandler.countPoints();
        this._gameInfo.gameStatus.incrementScorePlayer(points.player);
        this._gameInfo.gameStatus.incrementScoreComputer(points.computer);
        let newState: AbstractGameState;
        if (this._gameInfo.gameStatus.currentSet < EndSet.NUMBER_OF_SETS_TO_PLAY) {
            this._gameInfo.gameStatus.currentSet += 1;
            this._gameInfo.gameStatus.resetStones();
            this._gameServices.stoneHandler.cleanAllStones();
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
