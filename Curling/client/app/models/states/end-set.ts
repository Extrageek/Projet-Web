import { Vector3 } from "three";
import { AbstractGameState } from "./abstract-game-state";
import { LoadingStone } from "./loading-stone";
import { EndGame } from "./end-game";
import { CurrentPlayer } from "../../models/current-player";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

export class EndSet extends AbstractGameState {

    private static readonly NUMBER_OF_SETS_TO_PLAY = 3;
    private static readonly TEXT_POSITION_ABOVE = new Vector3(6, 3, -11.4);
    private static readonly TEXT_POSITION_BELOW = new Vector3(10, 1, -11.4);
    private static readonly TEXT_COLOR = 0x000000;

    private static _instance: AbstractGameState = null;
    private _newState : AbstractGameState = null;
    private transitionText: number[] = new Array<number>();
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
            this._newState = LoadingStone.getInstance();
            this._gameServices.cameraService.setPerspectiveCameraCurrent();
            this.transitionText.push(this._gameServices.textureHandler.addText(EndSet.TEXT_POSITION_ABOVE,
                "Veuillez cliquez pour", EndSet.TEXT_COLOR));
            this.transitionText.push(this._gameServices.textureHandler.addText(EndSet.TEXT_POSITION_BELOW,
                "commencer la prochaine manche", EndSet.TEXT_COLOR));
        }
        else {
            this.leaveState(EndGame.getInstance());
        }
    }

    protected performLeavingState(): Promise<void> {
        this.transitionText.forEach((identifier: number) => {
            this._gameServices.textureHandler.removeText(identifier);
        });
        this.transitionText.splice(0, this.transitionText.length);
        return Promise.resolve();;
    }

    //Bloc the camera toggle by overriding this method.
    protected performCameraToggle(): AbstractGameState {
        return null;
    }

    protected performMouseMove(): AbstractGameState {
        return null;
    }

    protected performMouseButtonPress(): AbstractGameState {
        return null;
    }

    protected performMouseButtonReleased(): AbstractGameState {
        return this._newState;
    }
}
