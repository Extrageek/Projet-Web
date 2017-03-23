import { AbstractGameState } from "./abstract-game-state";
import { IGameInfo } from "./../../services/game-handler/game-info.interface";
import { LoadingStone } from "./loading-stone";
import { CameraType } from "./../../services/game-physics/camera-type";
import { EndSet } from "./end-set";
import { GameComponent } from "../../models/game-component.interface";

export class PlayerShooting extends AbstractGameState implements GameComponent {

    private static _instance: AbstractGameState = null;
    private static readonly UPDATE_NAME = "PlayerShooting";
    /**
     * Initialize the unique PlayerShooting state.
     * @param gameInfo The informations to use by the state.
     * @param doInitialization Set to true only if the game is entering immediatly in this state.
     *  Only one game state could be constructed with this value at true, because only one game state
     *  must be active at a time.
     */
    public static createInstance(gameInfo: IGameInfo, doInitialization = false): void {
        PlayerShooting._instance = new PlayerShooting(gameInfo, doInitialization);
    }

    /**
     * Get the instance of the state PlayerShooting. This state is used while the stones are moving.
     * @returns The PlayerShooting state of null if the createInstance method has not been called.
     */
    public static getInstance(): AbstractGameState {
        return PlayerShooting._instance;
    }

    private constructor(gameInfo: IGameInfo, doInitialization = false) {
        super(gameInfo, doInitialization);
    }

    protected performEnteringState(): void {
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, PlayerShooting.UPDATE_NAME, {value: this});
        this._gameInfo.scene.add(this._gameInfo.broom);
        //TODO : CHANGE GREEN ONCE YOU PASS THE FIRST LINE
        this._gameInfo.broom.changeToGreen();
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
        delete this._gameInfo.gameComponentsToUpdate[PlayerShooting.UPDATE_NAME];
        this._gameInfo.scene.remove(this._gameInfo.broom);
        this._gameInfo.stoneHandler.removeOutOfBoundsStones(this._gameInfo.scene);
        this._gameInfo.gameStatus.nextPlayer();
        this._gameInfo.cameraService.replacePCameraToInitialPosition();
    }

    protected performMouseMove(event: MouseEvent): AbstractGameState {

        let currentCamera: THREE.Camera;
        if (this._gameInfo.currentCamera === CameraType.PERSPECTIVE_CAM) {
            currentCamera = this._gameInfo.cameraService.perspectiveCamera;
        }
        else if (this._gameInfo.currentCamera === CameraType.ORTHOGRAPHIC_CAM) {
            currentCamera = this._gameInfo.cameraService.topViewCamera;
        }
        let x = (event.clientX / window.innerWidth) * 2 - 1;
        let y = - (event.clientY / window.innerHeight) * 2 + 1;

        let mouseVector = new THREE.Vector3(x, y, 0.5);
        mouseVector.unproject(currentCamera);
        let direction = mouseVector.sub(currentCamera.position ).normalize();
        let distance = - currentCamera.position.z / direction.z;
        let position = currentCamera.position.clone().add( direction.multiplyScalar(distance));

        this._gameInfo.broom.position.set(position.x, 0 , position.y + 8.5);
        return null;
    }

    protected performMouseButtonPress(): AbstractGameState {
        if (!this._gameInfo.broom.isRed()) {
            this._gameInfo.broom.position.add(new THREE.Vector3(0.2, 0, 0));
            // TODO : A VOIR COMMENT ENLEVER GET ELEM
            let sound = document.getElementById("broomIn");
            (<HTMLAudioElement>sound).play();
        }
        return null;
    }

    protected performMouseButtonReleased(): AbstractGameState {
        if (!this._gameInfo.broom.isRed()) {
            this._gameInfo.broom.translateZ(0.3);
            console.log("in out");
            // TODO : A VOIR COMMENT ENLEVER GET ELEM
            let sound = document.getElementById("broomOut");
            (<HTMLAudioElement>sound).play();
        }
        return null;
    }

    public update(timePerFrame: number) {
        if (this._gameInfo.stoneHandler.checkPassHogLine()) {
            this._gameInfo.broom.changeToRed();
        }
    }
}
