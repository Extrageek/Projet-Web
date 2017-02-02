import { Injectable } from '@angular/core';
import { GameSettingsService } from './game-settings.service';

@Injectable()
export class RenderService {
    private _gameSettings: GameSettingsService;

    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;
    private _renderer: THREE.Renderer;
    private _geometry: THREE.Geometry;
    //private _material: THREE.MeshBasicMaterial;
    private _material: THREE.MeshFaceMaterial;
    private _mesh: THREE.Mesh;
    //private controls: THREE.OrbitControls;

    private _useAngle: boolean;
    private _camX: number;
    private _camY: number;
    private _camZ: number;
    private _wf: boolean;
    private _clock: THREE.Clock;
    private _dt: number;

    private _font: THREE.Font;
    private _text: string;
    private _textMaterial: THREE.MultiMaterial;
    private _textGroup: THREE.Group;
    private _fontLoader: THREE.FontLoader;
    private _textMesh: THREE.Mesh;
    private _fontName: string;

    private _objectLoader: THREE.ObjectLoader;
    //private bbHelper: THREE.BoxHelper;
    //private updateBbHelper: boolean;

    private _created : THREE.Mesh[];

    constructor() {
        this._scene = new THREE.Scene();
        this._wf = true;
         // Array to hold our created objects from the factory
        this._created = [];
        this._objectLoader = new THREE.ObjectLoader();
        this._gameSettings = new GameSettingsService();
    }

    public init(container: HTMLElement) {
        //Part 1: Camera
        this.setUpCamera();
        this.initializePlane();

        //Part 2: Scenery
        this.setUpLightning(); //Because lighting is everything
        this.generateSkybox();

        //Part 3: Components
        this.loadFont();
        this.loadRink();
        //if (this._gameSettings.getIsFirstPlayer() === true) {
            this.loadStoneRed();
        //} else {
        //    this.loadStoneBlue();
        //}

        //Part 4: Service
        this.linkRenderServerToCanvas(container);

        //Part 5: Events
        // bind to window resizes
        window.addEventListener('resize', _ => this.onResize());
    }

    public linkRenderServerToCanvas(container: HTMLElement): void{
        // Inser the canvas into the DOM
        //var container = document.getElementById("glContainer");
        if (container.getElementsByTagName('canvas').length === 0) {
            container.appendChild(this._renderer.domElement);
        }
        this._clock.start();
        this.animate();
        }

    public setUpCamera(): void {
        this._useAngle = false;
        this._clock = new THREE.Clock();

        this._renderer = new THREE.WebGLRenderer({antialias: true, devicePixelRatio: window.devicePixelRatio});
        this._renderer.setSize(window.innerWidth, window.innerHeight, true);

        this._camX = 0;
        this._camY = 10;
        this._camZ = 50;
        this._camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 150);
        this._camera.position.set(this._camX, this._camY, this._camZ);
    }

    public initializePlane(): void {
        let x: THREE.Mesh;
        x = new THREE.Mesh(new THREE.SphereGeometry(150, 15, 15),
                           new THREE.MeshBasicMaterial({wireframe: true}));

        let plane: THREE.Mesh = new THREE.Mesh(
        new THREE.CircleBufferGeometry( 1.83 , 32),
            new THREE.MeshBasicMaterial( { color: 16711680, opacity: 1, transparent: false, wireframe: true})
         );
        plane.position.x = 0;
        plane.position.z = 0;

        this._scene.add(plane);
    }

    public setUpLightning(): void {
        this._scene.add(new THREE.AmbientLight(0x444444));
        let dirLight = new THREE.DirectionalLight(0xeeeeee);
        dirLight.position.set(0, 0, 1);
        dirLight.position.normalize();
        this._scene.add(dirLight);
    }

     /**
     * See : http://danni-three.blogspot.ca/2013/09/threejs-skybox.html
     */
    public generateSkybox(): void{
        let imagePrefix = "../../assets/images/frozen_";
        let directions = ["rt", "lf", "up", "dn", "ft", "bk"];
        let imageSuffix = ".jpg";
        let materialArray = [];
        for (let i = 0; i < 6; i++) {
            materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
            }));
        }
        this._geometry = new THREE.CubeGeometry( 200, 200, 200);
        this._material = new THREE.MeshFaceMaterial( materialArray );
        this._mesh = new THREE.Mesh( this._geometry, this._material );
        this._scene.add( this._mesh );
    }

    // Load the font
    public loadFont(): void{
        this._fontLoader = new THREE.FontLoader();
        this._textMaterial = new THREE.MultiMaterial([
            new THREE.MeshPhongMaterial({shading: THREE.FlatShading}), // front
            new THREE.MeshPhongMaterial({shading: THREE.SmoothShading})
            ]
        );
        this._textGroup = new THREE.Group();
        this._textGroup.position.y = 100;
        this._scene.add(this._textGroup);
        this._fontName = 'helvetiker_regular';
    }

    public loadRink(): void {
        this._objectLoader.load('/assets/models/json/curling-rink.json', obj => {
            obj.position.set(0, 0, 0);
            obj.scale.set(2, 2, 2);
            this._mesh.add(obj);
            (obj as THREE.Mesh).material = new THREE.MeshPhongMaterial({
                wireframe: false,
                shininess: 0.2,
            });
        });
    }

    public loadStoneRed(): void {
        this._objectLoader.load('/assets/models/json/curling-stone-red.json', obj => {
            obj.position.set(0, 0, 25);
            obj.scale.set(2, 2, 2);
            this._mesh.add(obj);
            (obj as THREE.Mesh).material = new THREE.MeshPhongMaterial({
                wireframe: false,
                shininess: 0.2,
            });
        });
    }

    public loadStoneBlue(): void {
        this._objectLoader.load('/assets/models/json/curling-stone-blue.json', obj => {
            obj.position.set(0, 0, -10);
            obj.scale.set(2, 2, 2);
            this._mesh.add(obj);
            (obj as THREE.Mesh).material = new THREE.MeshPhongMaterial({
                wireframe: false,
                shininess: 0.2,
            });
        });
    }

     animate(): void {
        window.requestAnimationFrame(_ => this.animate());
        this._dt = this._clock.getDelta();

        this.avancer(this._dt);

        //this.mesh.rotation.y += 0.01;
        let tp: THREE.Object3D = this._scene.getObjectByName('Teapot001');
        if (tp !== undefined) {
            (tp as THREE.Mesh).rotateZ(this._dt);
        }
        this.render();
    }

    onWindowResize() {
        let factor = 0.8;
        let newWidth: number = window.innerWidth * factor;
        let newHeight: number = window.innerHeight * factor;

        this._camera.aspect = newWidth / newHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(newWidth, newHeight);
    }

    render(): void {
        this._renderer.render(this._scene, this._camera);
    }

    toggleWireFrame(): void {
         this._wf = !this._wf;
         //this._material.wireframe = this._wf;
         this._material.needsUpdate = true;
     }

    avancer(deltaT: number): void {
        //deltaT = deltaT + 1;
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    /* This version loads the font each time, not efficient ! */
    slowCreateText() {
        console.log(this);
        this._fontLoader.load('/assets/fonts/helvetiker_regular.typeface.json', r => {
            this._scene.remove(this._textGroup);
            this._textGroup.remove(this._textMesh);
            this._font = new THREE.Font(r);
            let f = Object(r);

            let textGeo: THREE.TextGeometry = new THREE.TextGeometry( this._text, {
                font: f as THREE.Font,
                size: 20,
                height: 20,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: false
            });
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            let centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
            this._textMesh = new THREE.Mesh( textGeo, this._textMaterial );
            this._textMesh.position.x = centerOffset;
            this._textMesh.position.y = 50;
            this._textMesh.position.z = 0;
            this._textMesh.rotation.x = 0;
            this._textMesh.rotation.y = Math.PI * 2;
            this._textGroup.add( this._textMesh );
            this._scene.add(this._textGroup);
        });
    }

    private refreshText(): void {
        this.slowCreateText();
    }

    public setText(newText: string): void {
        this._text = newText;
        this.refreshText();
    }

    public print(): void {
        console.log(this);
    }

    public translateMesh(x: number, y: number): void {
        print();
        this._mesh.position.x += x;
        this._mesh.position.y += y;
    }

    public translateCamera(x: number, y: number, z: number): void {
        this._camera.position.x += x === undefined ? 0 : x ;
        this._camera.position.y += y === undefined ? 0 : y ;
        this._camera.position.z += z === undefined ? 0 : z ;
        this._camera.updateProjectionMatrix();
    }
}
