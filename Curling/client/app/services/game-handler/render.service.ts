import { Injectable } from "@angular/core";
import {
    Scene, PerspectiveCamera, WebGLRenderer, Renderer, ObjectLoader, Geometry,
    CubeGeometry, MeshBasicMaterial, MultiMaterial, Mesh, Line,
    LineDashedMaterial, ImageUtils, BackSide, Vector3, Clock
} from "three";

import { GameStatusService } from "./../game-status.service";
import { CameraService } from "./../views/cameras.service";
import { LightingService } from "./../views/ligthing.service";
import { ParticlesService } from "./../game-physics/particles.service";

import { StoneHandler } from "../game-physics/stone-handler";
import { TextureHandler } from "../views/texture-handler";
import { CameraType } from "../game-physics/camera-type";

import { Rink } from "./../../models/scenery/rink";
import { StoneColor } from "./../../models/stone";
import { Arena } from "./../../models/scenery/arena";
import { Broom } from "./../../models/broom";
import { LoadingStone } from "./../../models/states/loading-stone";
import { PlayerTurn } from "./../../models/states/player-turn";
import { ComputerTurn } from "./../../models/states/computer-turn";
import { PlayerShooting } from "./../../models/states/player-shooting";
import { ComputerShooting } from "./../../models/states/computer-shooting";
import { EndSet } from "./../../models/states/end-set";
import { EndGame } from "./../../models/states/end-game";

import { RinkInfo } from "./../../models/scenery/rink-info.interface";
import { IGameInfo } from "./game-info.interface";
import { SoundManager } from "../sound-manager";

@Injectable()
export class RenderService {

    private static readonly NUMBER_OF_MODELS_TO_LOAD = 4;

    private _numberOfModelsLoaded: number;
    private _currentCamera: PerspectiveCamera;
    private _lightingService: LightingService;
    private _objectLoader: ObjectLoader;
    private _mesh: Mesh;
    private _clock: Clock;
    private _renderer: Renderer;
    private _animationStarted: boolean;
    private _endStateAnimationStarted: boolean;

    private _gameInfo: IGameInfo;

    constructor(gameStatusService: GameStatusService,
        cameraService: CameraService,
        lightingService: LightingService) {
        this._gameInfo = {
            gameStatus: gameStatusService,
            cameraService: cameraService,
            broom: null,
            rink: null,
            scene: new Scene(),
            currentCamera: CameraType.PERSPECTIVE_CAM,
            gameComponentsToUpdate: new Object(),
            isSelectingPower: false,
            line: { lineGeometry: null, lineDashedMaterial: null, lineMesh: null, lineAnimationSlower: null },
            mousePositionPlaneXZ: new Vector3(0, 0, 0),
            powerBar: 0,
            gameState: null,
            shotParameters: { spin: 0, direction: null, power: null },
            stoneHandler: null,
            textureHandler: null,
            particlesService: null,
        };
        this._lightingService = lightingService;
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, "cameraService", { value: cameraService });
        this._gameInfo.gameStatus.randomFirstPlayer();
        this._animationStarted = false;
        this._endStateAnimationStarted = false;
        this._numberOfModelsLoaded = 0;
        this._objectLoader = new ObjectLoader();
    }

    public init(container: HTMLElement) {
        if (this._gameInfo.scene.children.length > 0) {
            this.linkRenderServerToCanvas(container);
            window.addEventListener("resize", _ => this.onResize());
            return;
        }
        //Clock for the time per frame.
        this._clock = new Clock(false);

        this._renderer = new WebGLRenderer({ antialias: true, devicePixelRatio: window.devicePixelRatio });
        this._renderer.setSize(window.innerWidth, window.innerHeight, true);

        this._currentCamera = this._gameInfo.cameraService.perspectiveCamera;

        //Part 2: Scenery
        this.generateSkybox();
        this._lightingService.setUpLighting(this._gameInfo.scene);

        //Part 3: Components
        this.loadComponents();

        //Part 4: Service
        this.linkRenderServerToCanvas(container);

        //Part 5: Events
        // bind to window resizes
        window.addEventListener("resize", _ => this.onResize());
    }

    get gameInfo(): IGameInfo {
        return this._gameInfo;
    }

    public loadComponents() {
        this.loadTextureHandler();
        this.loadRink();
        this.loadArena();
        this.loadLine();
        this.loadBroom();
    }

    public loadLine() {
        let geometry = new Geometry();
        geometry.vertices.push(new Vector3(0, 0.1, -18)); // First HogLine
        geometry.vertices.push(new Vector3(0, 0.1, 22.4)); // EndPoint
        geometry.computeLineDistances();

        let material = new LineDashedMaterial({
            color: 0x0000e0,
            linewidth: 5,
            dashSize: 1,
            gapSize: 1,
            visible: false
        });

        this._gameInfo.line.lineGeometry = geometry;
        this._gameInfo.line.lineDashedMaterial = material;
        this._gameInfo.line.lineMesh = new Line(geometry, material);
        this._gameInfo.line.lineAnimationSlower = 0;
        this._gameInfo.scene.add(this._gameInfo.line.lineMesh);
    }

    public linkRenderServerToCanvas(container: HTMLElement) {
        // Inser the canvas into the DOM
        if (container.getElementsByTagName("canvas").length === 0) {
            container.appendChild(this._renderer.domElement);
        }
    }

    /**
     * See : http://danni-three.blogspot.ca/2013/09/threejs-skybox.html
     */
    public generateSkybox() {
        let imagePrefix = "../../assets/images/scenery_";
        let directions = ["right", "left", "up", "down", "front", "back"];
        let imageSuffix = ".jpg";
        let materialArray = Array<MeshBasicMaterial>();
        for (let i = 0; i < 6; i++) {
            materialArray.push(new MeshBasicMaterial({
                map: ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
                side: BackSide
            }));
        }
        let material = new MultiMaterial(materialArray);
        let geometry = new CubeGeometry(200, 200, 200);
        this._mesh = new Mesh(geometry, material);
        this._gameInfo.scene.add(this._mesh);
    }

    private loadTextureHandler() {
        TextureHandler.createTextureHandler(this._gameInfo.scene)
            .then((textureHandler: TextureHandler) => {
                this._gameInfo.textureHandler = textureHandler;
                this.onFinishedLoadingModel();
            })
            .catch((error) => {
                //Switch to error state
                console.log(error);
            });
    }
    public loadBroom() {
        Broom.createBroom(this._objectLoader, new Vector3(0, 0, -11.4))
            .then((broom: Broom) => {
                this._gameInfo.broom = broom;
                this.onFinishedLoadingModel();
            });
    }

    private loadRink() {
        Rink.createRink(this._objectLoader).then((rink: Rink) => {
            this._mesh.add(rink);
            this._gameInfo.rink = rink;
            this.loadStoneHandler(rink);
        });
    }

    private loadArena() {
        Arena.createArena(this._objectLoader).then((arena: Arena) => {
            //this._sceneryService.mesh.add(arena);
            //this._mesh.add(arena);
            this.onFinishedLoadingModel();
        });
    }

    //Must be called after the rinkinfo is initialised.
    private loadStoneHandler(rinkInfo: RinkInfo) {
        let stoneColor: StoneColor;
        stoneColor = this._gameInfo.gameStatus.currentPlayer === 0 ? StoneColor.Blue : StoneColor.Red;
        this._gameInfo.stoneHandler = new StoneHandler(this._objectLoader, rinkInfo, stoneColor);
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, "stoneHandler",
            { value: this._gameInfo.stoneHandler });
        this.initializeAllStates(stoneColor);
        this._gameInfo.gameState = LoadingStone.getInstance();
        this.onFinishedLoadingModel();
    }

    private initializeAllStates(stoneColor: number) {
        LoadingStone.createInstance(this._gameInfo, true);
        PlayerTurn.createInstance(this._gameInfo);
        ComputerTurn.createInstance(this._gameInfo);
        PlayerShooting.createInstance(this._gameInfo);
        ComputerShooting.createInstance(this._gameInfo);
        EndSet.createInstance(this._gameInfo);
        EndGame.createInstance(this._gameInfo);
    }

    public switchCamera() {
        this._currentCamera = this._gameInfo.cameraService.nextCamera();
        this._gameInfo.currentCamera = (this._gameInfo.currentCamera + 1) % CameraType.NB_CAMERAS;
        this.onResize();
    }

    private onFinishedLoadingModel() {
        ++this._numberOfModelsLoaded;
        if (!this._animationStarted && this._numberOfModelsLoaded >= RenderService.NUMBER_OF_MODELS_TO_LOAD) {
            this._animationStarted = true;
            if (document.hasFocus()) {
                this._clock.start();
            }
            // Add events here to be sure they won"t encounter undefined property
            window.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event));
            window.addEventListener("keydown", (event: KeyboardEvent) => this.switchSpin(event));
            window.addEventListener("mousedown", _ => this.onMousePressed());
            window.addEventListener("mouseup", _ => this.onMouseReleased());
            this.animate();
        }
    }

    private animate() {
        window.requestAnimationFrame(() => this.animate());

        if (this._clock.running === true) {
            let timePerFrame = this._clock.getDelta();
            //Execute the update action in the state
            this._gameInfo.gameState.update(timePerFrame);
            //Update the other components
            let keys = Object.getOwnPropertyNames(this._gameInfo.gameComponentsToUpdate);
            keys.forEach((key: string) => {
                this._gameInfo.gameComponentsToUpdate[key].update(timePerFrame);
            });

            // Following Action only done at the end of the game
            if (this._gameInfo.gameState === EndGame.getInstance()) {
                // Following action only done once
                if (!this._endStateAnimationStarted) {
                    // We want the animation to be done in a perspective view
                    this._endStateAnimationStarted = true;
                    this.setEndGameView();
                }
                this._gameInfo.particlesService.update();
            }
        }
        this._renderer.render(this._gameInfo.scene, this._currentCamera);
    }

    private setEndGameView() {
        if (this._currentCamera === this._gameInfo.cameraService.topViewCamera) {
            this.switchCamera();
        }
        this._gameInfo.cameraService.moveCameraEndRink();
    }

    public toogleFocus(toogle: boolean) {
        if (toogle === true) {
            this._clock.start();
        }
        else {
            this._clock.stop();
        }
    }

    onWindowResize() {
        let factor = 0.8;
        let newWidth: number = window.innerWidth * factor;
        let newHeight: number = window.innerHeight * factor;

        this._currentCamera.aspect = newWidth / newHeight;
        this._currentCamera.updateProjectionMatrix();

        this._renderer.setSize(newWidth, newHeight);
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this._currentCamera.aspect = width / height;
        this._currentCamera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    switchSpin(event: KeyboardEvent) {
        let sKeyCode = 83;
        if (event.keyCode === sKeyCode) {
            this._gameInfo.shotParameters.spin = (this._gameInfo.shotParameters.spin + 1) % 2;
        }
    }

    onMouseMove(event: MouseEvent) {
        this._gameInfo.gameState.onMouseMove(event);
    }

    onMousePressed() {
        this._gameInfo.gameState.onMouseButtonPress();
    }

    onMouseReleased() {
        this._gameInfo.gameState.onMouseButtonReleased();
    }
}
