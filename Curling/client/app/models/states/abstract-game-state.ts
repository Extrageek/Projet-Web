import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { forEach } from "@angular/router/src/utils/collection";

export abstract class AbstractGameState {

    private static hasDoneInitialization = false;

    private _isActive: boolean;
    protected _gameInfo: IGameInfo;

    /**
     * Cannot be instantiated directly. Represent a state of the game to handle the different events.
     * @param gameInfo All the necessary informations of the game to handle the different events.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    protected constructor(gameInfo: IGameInfo, doInitialization: boolean) {
        if (gameInfo === null || gameInfo === undefined) {
            throw new Error("The game info parameter cannot be null or undefined");
        }
        this._gameInfo = gameInfo;

        if (doInitialization) {
            if (AbstractGameState.hasDoneInitialization) {
                throw new Error("One game state has already been initialized.");
            }
            AbstractGameState.hasDoneInitialization = true;
            this.enteringState();
        }
        this._isActive = doInitialization;
    }

    private enteringState() {
        this._isActive = true;
        this.performEnteringState();
    }

    private leavingState() {
        this._isActive = false;
        this.performLeavingState();
    }

    /**
     * Force to change to the new state.
     * ALWAYS calls this function when a state transition is needed.
     * DO NOT only change the _gameInfo.gameStatus variable because the _isActive property will not be changed.
     * Avoid to call this function in one of mouse abstract methods. It will be automatically called when these
     * methods return.
     * @param newState The new state to go.
     */
    protected leaveState(newState: AbstractGameState) {
        let paramFromLastState = this.leavingState();
        this._gameInfo.gameState = newState;
        newState.enteringState();
    }

    /**
     * Perform the action passed in parameter, execute the leavingState, enteringState and update the game state
     * if necessary.
     * @param actionToExecute The action that must be done. Returns the AbstractGameState to switch or null.
     *
     *  It is the responsability of the caller to store the new state returned if it's the case, because if a
     *  transition occured, the current object will be desactivated and will throw an error if it's event method
     *  are called.
     */
    private performAction(actionToExecute: () => AbstractGameState) {
        if (!this._isActive) {
            throw new Error("This state is not active at the moment.");
        }
        let newState = actionToExecute.call(this);
        if (newState !== null) {
            this.leaveState(newState);
        }
    }

    /**
     * Method to call when a mouse movement is detected. It will execute the corresponding action for the game.
     * @returns AbstractGameState The new state to which it is transited, or null if no transition was done.
     */
    public onMouseMove(event: MouseEvent) {
        this.performAction(this.performMouseMove.bind(this, event));
    }

    /**
     * Method to call when the left mouse button is detected. It will execute the corresponding action for the game.
     * @returns AbstractGameState The new state to which it is transited, or null if no transition was done.
     */
    public onMouseButtonPress() {
        this.performAction(this.performMouseButtonPress);
    }

    /**
     * Method to call when the left mouse button is released. It will execute the corresponding action for the game.
     * @returns AbstractGameState The new state to which it is transited, or null if no transition was done.
     */
    public onMouseButtonReleased() {
        this.performAction(this.performMouseButtonReleased);
    }

    protected abstract performEnteringState(): void;

    protected abstract performLeavingState(): void;

    protected abstract performMouseMove(event: MouseEvent): AbstractGameState

    protected abstract performMouseButtonPress(): AbstractGameState;

    protected abstract performMouseButtonReleased(): AbstractGameState;
}
