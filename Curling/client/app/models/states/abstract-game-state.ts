import { Vector3 } from "three";
import { StoneSpin } from "../stone";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { ShotParameters } from "../shot-parameters.interface";
import { GameComponent } from "../game-component.interface";

export abstract class AbstractGameState implements GameComponent {

    private static hasDoneInitialization = false;
    //For states that need parameters for shooting
    protected static shotParameters: ShotParameters = {
        spin: StoneSpin.Clockwise,
        direction: new Vector3(0, 0, 1),
        power: 0
    };
    //Function to call when changing from a state to another one.
    private static onChangingState: (abstractGameState: AbstractGameState) => void;

    private _isActive: boolean;
    protected _gameServices: IGameServices;
    protected _gameInfo: IGameInfo;

    /**
     * Cannot be instantiated directly. Represent a state of the game to handle the different events.
     * @param gameInfo All the necessary informations of the game to handle the different events.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    protected constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        if (gameInfo === null || gameInfo === undefined) {
            throw new Error("The game info parameter cannot be null or undefined.");
        }
        if (gameServices === null || gameServices == undefined) {
            throw new Error("The game services parameter cannot be null or undefined.");
        }
        this._gameServices = gameServices;
        this._gameInfo = gameInfo;
        this._isActive = false;
    }

    /**
     * Start the game with this state.
     * @param onChangingState A function to call with the new state as a parameter when the state changes.
     *    This function should be handled by the StatesHandler.
     */
    public beginWithThisState(onChangingState = (abstractGameState: AbstractGameState) => {}) {
        if (AbstractGameState.hasDoneInitialization) {
            throw new Error("A state has already been initialized.");
        }
        AbstractGameState.onChangingState = onChangingState;
        AbstractGameState.hasDoneInitialization = true;
        this.enteringState();
    }

    /**
     * Call this function to interrupt the game. It will leave the current state and will not enter in a new state.
     * It can be used to restart the game.
     * The beginWithThisState method must be called on a state to restart the game.
     * This function can only be called on the active state.
     * This function should be handled by the StatesHandler.
     */
    public forceExitState() {
        if (!this._isActive) {
            throw new Error("The force exit method must be called on the active state.");
        }
        this.leavingState();
        AbstractGameState.hasDoneInitialization = false;
        AbstractGameState.onChangingState(null);
        AbstractGameState.onChangingState = null;
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
        this.leavingState();
        AbstractGameState.onChangingState(newState);
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
     * Method to call when the button to switch spin is pressed. It will execute the corresponding action for the game.
     * 
     */
    public onSpinButtonPressed() {
        this.performAction(this.performSpinButtonPressed);
    }

    /**
     * Method to call when the space button is pressed. It will execute the corresponding action for the game.
     */
    public onSpaceBarPressed() {
        this.performAction(this.performCameraToggle);
    }

    /**
     * Method to call when a mouse movement is detected. It will execute the corresponding action for the game.
     */
    public onMouseMove(event: MouseEvent) {
        this.performAction(this.performMouseMove.bind(this, event));
    }

    /**
     * Method to call when the left mouse button is detected. It will execute the corresponding action for the game.
     */
    public onMouseButtonPress() {
        this.performAction(this.performMouseButtonPress);
    }

    /**
     * Method to call when the left mouse button is released. It will execute the corresponding action for the game.
     */
    public onMouseButtonReleased() {
        this.performAction(this.performMouseButtonReleased);
    }

    public update(timePerFrame: number) {
        //Do nothing by default. The children classes can override this method.
    }

    protected abstract performEnteringState(): void;

    protected abstract performLeavingState(): void;

    /**
     * The children classes can override this method to give a particular behaviour when the spin button is pressed.
     * @returns AbstractGameState The new state to which it must transit, or null if no transition is necessary.
     */
    protected performSpinButtonPressed(): AbstractGameState {
        return null;
    }

    /**
     * The children classes can override this method to give a particular behaviour when the button to toggle the
     * camera is pressed.
     * @returns AbstractGameState The new state to which it must transit, or null if no transition is necessary.
     */
    protected performCameraToggle(): AbstractGameState {
        return null;
    }

    protected abstract performMouseMove(event: MouseEvent): AbstractGameState

    protected abstract performMouseButtonPress(): AbstractGameState;

    protected abstract performMouseButtonReleased(): AbstractGameState;
}
