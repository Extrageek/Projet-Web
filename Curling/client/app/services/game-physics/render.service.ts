import { Injectable } from "@angular/core";
import { Scene, PerspectiveCamera, WebGLRenderer, Renderer, ObjectLoader, FontLoader, Geometry, CubeGeometry,
    TextGeometry, MeshBasicMaterial, MeshFaceMaterial, MeshPhongMaterial, MultiMaterial, Mesh, SpotLight, Group,
    Font, ImageUtils, BackSide, FlatShading, SmoothShading, Vector3, Clock } from "three";
import { GameStatusService } from './../game-status.service';
import { CameraService } from './../views/cameras.service';
import { Arena } from './../../models/scenery/arena';
import { Rink } from './../../models/scenery/rink';
import { Stone, StoneColor } from './../../models/stone';
import { RinkInfo } from './../../models/scenery/rink-info.interface';
import { StoneHandler } from './stone-handler';
import { CameraType } from './camera-type';

import { LightingService } from './../views/ligthing.service';
import { TextureService } from './texture.service';

@Injectable()
export class RenderService {

    private static readonly NUMBER_OF_MODELS_TO_LOAD = 2;
    private static readonly LINE_WAIT = 2;

    private _numberOfModelsLoaded: number;
    private _scene: Scene;
    private _currentCamera: PerspectiveCamera;
    private _currentCameraType: CameraType;
    private _renderer: Renderer;
    private _geometry: Geometry;
    private _material: MeshFaceMaterial;
    private _mesh: Mesh;
    private _lineGeometry: Geometry;
    private _lineMaterial: THREE.LineDashedMaterial;
    private _lineAnimationSlower: number;
    private _line: THREE.Line;

    private _clock: Clock;

    // private _font: Font;
    // private _text: string;
    // private _textMaterial: MultiMaterial;
    // private _textGroup: Group;
    // private _fontLoader: FontLoader;
    // private _textMesh: Mesh;
    // private _fontName: string;

    private _rinkInfo: RinkInfo;
    private _stoneHandler: StoneHandler;

    private _objectLoader: ObjectLoader;
    private _animationStarted: boolean;

    constructor(
        private _gameStatusService: GameStatusService,
        private _cameraService: CameraService,
        private _lightingService: LightingService,
        private _textureService: TextureService) {
        this._scene = new Scene();
        this._animationStarted = false;
        this._numberOfModelsLoaded = 0;
        this._objectLoader = new ObjectLoader();
    }

    public init(container: HTMLElement) {
        this.loadLine();
        this._clock = new Clock(false);

        this._renderer = new WebGLRenderer({antialias: true, devicePixelRatio: window.devicePixelRatio});
        this._renderer.setSize(window.innerWidth, window.innerHeight, true);

        this._currentCamera = this._cameraService.perspectiveCamera;
        this._currentCameraType = CameraType.PERSPECTIVE_CAM;

        //Part 2: Scenery
        //this.setUpLighting(); //Because lighting is everything
        this._lightingService.setUpLighting(this._scene);
        this.generateSkybox();

        //Part 3: Components
        //this.loadFont();
        this._textureService.loadFont(this._scene);
        this.loadRink();
        this.loadArena();

        //Part 4: Service
        this.linkRenderServerToCanvas(container);

        //Part 5: Events
        // bind to window resizes
        window.addEventListener('resize', _ => this.onResize());
    }

    public loadLine() {
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0.1, -11.1)); // First HogLine
        geometry.vertices.push(new THREE.Vector3(0, 0.1, 22.4)); // EndPoint
        geometry.computeLineDistances();

        let material = new THREE.LineDashedMaterial({
            color: 0x0000e0,
            linewidth: 5,
            dashSize: 1,
            gapSize: 1
        });

        this._lineGeometry = geometry;
        this._lineMaterial = material;
        this._line = new THREE.Line(this._lineGeometry, this._lineMaterial);
        this._scene.add(this._line);
        this._lineAnimationSlower = 0;
    }

    public linkRenderServerToCanvas(container: HTMLElement) {
        // Inser the canvas into the DOM
        if (container.getElementsByTagName('canvas').length === 0) {
            container.appendChild(this._renderer.domElement);
        }
    }

    /**
     * See : http://danni-three.blogspot.ca/2013/09/threejs-skybox.html
     */
    public generateSkybox() {
        let imagePrefix = "../../assets/images/frozen_";
        let directions = ["rt", "lf", "up", "dn", "ft", "bk"];
        let imageSuffix = ".jpg";
        let materialArray = Array<MeshBasicMaterial>();
        for (let i = 0; i < 6; i++) {
            materialArray.push( new MeshBasicMaterial({
                map: ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
                side: BackSide
            }));
        }
        this._geometry = new CubeGeometry( 200, 200, 200);
        this._material = new MeshFaceMaterial( materialArray );
        this._mesh = new Mesh( this._geometry, this._material );
        this._scene.add( this._mesh );
    }

    // // Load the font
    // public loadFont() {
    //     this._fontLoader = new FontLoader();
    //     this._textMaterial = new MultiMaterial([
    //             new MeshPhongMaterial({shading: FlatShading}), // front
    //             new MeshPhongMaterial({shading: SmoothShading})
    //         ]
    //     );
    //     this._textGroup = new Group();
    //     this._textGroup.position.y = 100;
    //     this._scene.add(this._textGroup);
    //     this._fontName = 'helvetiker_regular';
    // }

    public loadRink() {
        Rink.createRink(this._objectLoader).then((rink: Rink) => {
            this._rinkInfo = rink;
            this._mesh.add(rink);
            this.loadStoneHandler();
            this.loadStone();
        });
    }

    public loadArena() {
        Arena.createArena(this._objectLoader).then((arena: Arena) => {
            this._mesh.add(arena);
            this.onFinishedLoadingModel();
        });
    }

    //Must be called after the rinkinfo is initialised.
    public loadStoneHandler() {
        let stoneColor: StoneColor;
        if (this._gameStatusService.randomFirstPlayer() === false) {
            stoneColor = StoneColor.Blue;
        } else {
            stoneColor = StoneColor.Red;
        }
        this._stoneHandler = new StoneHandler(this._objectLoader, this._rinkInfo, stoneColor);
    }

    public loadStone() {
        this._stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(0, 0, -11.4);
            this._scene.add(stone);
            this._cameraService.movePerspectiveCameraToFollowObjectOnZ(stone);
            this.onFinishedLoadingModel();
        });
    }

    public switchCamera() {
        this._currentCamera = this._cameraService.nextCamera();
        this._currentCameraType = (this._currentCameraType + 1) % CameraType.NB_CAMERAS;
        this.onResize();
    }

    private onFinishedLoadingModel() {
        ++this._numberOfModelsLoaded;
        if (!this._animationStarted && this._numberOfModelsLoaded >= RenderService.NUMBER_OF_MODELS_TO_LOAD) {
            this._animationStarted = true;
            if (document.hasFocus()) {
                this._clock.start();
            }
            // Add events here to be sure they won't encounter undefined property
            window.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event));
            window.addEventListener('keydown', (event: KeyboardEvent) => this.switchSpin(event));
            window.addEventListener('mousedown', _ => this.onMousePressed());
            window.addEventListener('mouseup', _ => this.onMouseReleased());
            this.animate();
        }
    }

    private animate() {
        this.updateLine();
        window.requestAnimationFrame(_ => this.animate());
        // if (this._clock.running === true) {
        let timePerFrame = this._clock.getDelta();
        this._stoneHandler.update(timePerFrame);
        // }
        this._cameraService.update(timePerFrame);
        this._renderer.render(this._scene, this._currentCamera);
    }

    public updateLine() {
        if (this._gameStatusService.gameStatus.isShooting) {
            this._lineMaterial.visible = false;
        } else {
            this._lineMaterial.visible = true;
            if (this._lineAnimationSlower > RenderService.LINE_WAIT) {
                this._lineMaterial.gapSize = ++this._lineMaterial.gapSize % 3 + 1;
                this._lineAnimationSlower = 0;
            }
            ++this._lineAnimationSlower;
            this._lineGeometry.vertices.pop();
            this._lineGeometry.vertices.push(new Vector3(this._stoneHandler.mousePositionPlaneXZ.x, 0.1, 22.4));
            this._lineGeometry.computeLineDistances();
            this._lineGeometry.verticesNeedUpdate = true;
        }
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
            this._stoneHandler.invertSpin();
        }
    }

    onMouseMove(event: MouseEvent) {
        if (!this._gameStatusService.gameStatus.isShooting) {
            this._stoneHandler.calculateMousePosition(event, this._currentCameraType);
        }
    }

    onMousePressed() {
        if (!this._gameStatusService.gameStatus.isShooting) {
            this._stoneHandler.startPower();
            this._stoneHandler.mouseIsPressed = true;
        }
    }

    onMouseReleased() {
        if (this._stoneHandler.mouseIsPressed) {
            this._stoneHandler.mouseIsPressed = false;
            try {
                this._gameStatusService.gameStatus.isShooting = true;
                this._stoneHandler.performShot(this._lineGeometry.vertices[1].clone().normalize(), () => {
                    this._gameStatusService.gameStatus.usedStone();
                    this._gameStatusService.gameStatus.nextPlayer();
                    this._cameraService.replacePCameraToInitialPosition();
                    this.loadStone();
                    this._gameStatusService.gameStatus.isShooting = false;
                });
                this.removeOutOfBoundsStones();
            } catch (e) {
                if (e instanceof (RangeError)) {
                    this._gameStatusService.gameStatus.isShooting = false;
                } else {
                    throw e;
                }
            }
        }
    }

    // /* This version loads the font each time, not efficient ! */
    // slowCreateText() {
    //     console.log(this);
    //     this._fontLoader.load('/assets/fonts/helvetiker_regular.typeface.json', r => {
    //         this._scene.remove(this._textGroup);
    //         this._textGroup.remove(this._textMesh);
    //         this._font = new Font(r);
    //         let f = Object(r);

    //         let textGeo: TextGeometry = new TextGeometry( this._text, {
    //             font: f as Font,
    //             size: 20,
    //             height: 20,
    //             curveSegments: 4,
    //             bevelThickness: 2,
    //             bevelSize: 1.5,
    //             bevelEnabled: false
    //         });
    //         textGeo.computeBoundingBox();
    //         textGeo.computeVertexNormals();

    //         let centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    //         this._textMesh = new Mesh( textGeo, this._textMaterial );
    //         this._textMesh.position.x = centerOffset;
    //         this._textMesh.position.y = 50;
    //         this._textMesh.position.z = 0;
    //         this._textMesh.rotation.x = 0;
    //         this._textMesh.rotation.y = Math.PI * 2;
    //         this._textGroup.add( this._textMesh );
    //         this._scene.add(this._textGroup);
    //     });
    // }

    // private refreshText() {
    //     this.slowCreateText();
    // }

    // public setText(newText: string) {
    // //     this._text = newText;
    // //     this.refreshText();
    // }

    public updateText(newText: string) {
        this._textureService.setText(newText, this._scene);
    }

    public print() {
        console.log(this);
    }
    private removeOutOfBoundsStones() {
        for (let stone of this._stoneHandler.stoneToBeRemoved) {
            this._scene.remove(stone);
        }
    }

    public translateMesh(x: number, y: number) {
        print();
        this._mesh.position.x += x;
        this._mesh.position.y += y;
    }
}
