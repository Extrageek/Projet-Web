import { ObjectLoader, Group, MeshPhongMaterial, Object3D, Sphere, Vector3, Matrix3 } from "three";
import { IGameState } from "./game-state.interface";
import { PhysicEngine } from "../services/game-physics/physic-engine";
import { Observable } from "rxjs/Observable";

export enum StoneSpin {
    CounterClockwise = 0,
    Clockwise = 1
}

export enum StoneColor {
    Blue = 0,
    Red = 1,
    NumberOfColors = 2
}

export class Stone extends Group implements IGameState {

    private static readonly STONES_PATH = [
        "/assets/models/json/curling-stone-blue.json",
        "/assets/models/json/curling-stone-red.json"
    ];
    private static readonly ONE_SECOND = 1000;
    private static readonly TEN_MILLISECONDS = 10;
    public static readonly BOUNDING_SPHERE_RADIUS = 0.26;
    private static readonly SCALE = { x: 1, y: 1, z: 1 };
    private static readonly MATERIAL_PROPERTIES = { wireframe: false, shininess: 0.7 };
    private static readonly SECONDS_PER_FULL_ROTATION = 4;
    private static readonly UPPER_BOUNCE_BOUND = 5;
    private static readonly LOWER_BOUNCE_BOUND = 1;
    private static readonly UPPER_BOUNCE_INCREMENT_BOUND = 0.1;
    private static readonly LOWER_BOUNCE_INCREMENT_BOUND = 0.05;

    private _stoneColor: StoneColor;
    private _physicEngine: PhysicEngine;
    private _material: MeshPhongMaterial;
    //Bounding sphere used for collisions. Only works if the stones are displaced on the XZ plane.
    private _boundingSphere: Sphere;
    private _lastBoundingSphere: Sphere;
    private _lastPosition: Vector3;

    public get boundingSphere(): Sphere {
        return this._boundingSphere;
    }

    //The following getters and setters are used to transmit the informations to the physic engine to avoid
    //a direct access to the physic engine object from the outside.
    public get stoneColor() {
        return this._stoneColor;
    }

    public get isSweeping(): boolean {
        return this._physicEngine.isSweeping;
    }

    public set sweeping(sweep: boolean) {
        this._physicEngine.isSweeping = sweep;
    }

    public get speed(): number {
        return this._physicEngine.speed;
    }

    public set speed(speed: number) {
        this._physicEngine.speed = speed;
    }

    public get direction(): Vector3 {
        return this._physicEngine.direction;
    }

    public get material() {
        return this._material;
    }
    public set direction(direction: Vector3) {
        this._physicEngine.direction = direction;
    }

    public get spin(): StoneSpin {
        return this._physicEngine.spin;
    }

    public set spin(spin: StoneSpin) {
        this._physicEngine.spin = spin;
    }

    public static createStone(objectLoader: ObjectLoader, stoneColor: StoneColor, initialPosition: Vector3)
        : Promise<Stone> {
        return new Promise<Stone>((resolve, reject) => {
            objectLoader.load(
                Stone.STONES_PATH[stoneColor],
                (obj: Object3D) => {
                    resolve(new Stone(obj, initialPosition, stoneColor));
                }
            );
        });
    }

    //The constructor is private because the loading of the 3D model is asynchronous.
    //To obtain a Stone object, the createStone method must be called.
    //The <this> tag must have been put because of perhaps an error in the declaration of the parameters in the method
    //copy of typescript. Now, with the <this> tag, the group object passed in parameter is copied in the this class to
    //obtain a stone object.
    private constructor(obj: Object3D, initialPosition: Vector3, stoneColor: StoneColor) {
        super();
        this.copy(<this>obj, true);
        this.scale.set(Stone.SCALE.x, Stone.SCALE.y, Stone.SCALE.z);
        //Set position
        this._material = new MeshPhongMaterial(Stone.MATERIAL_PROPERTIES);
        this.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        this._lastPosition = initialPosition.clone();
        //Set bounding sphere
        this._boundingSphere = new Sphere(this.position, Stone.BOUNDING_SPHERE_RADIUS);
        this._lastBoundingSphere = this._boundingSphere;
        //Set other parameters
        this._stoneColor = stoneColor;
        this._physicEngine = new PhysicEngine(this.position, new Vector3(0, 0, 1), 0);
    }

    public revertToLastPosition() {
        this._boundingSphere = this._lastBoundingSphere;
        this.position.copy(this._lastPosition);
    }

    public update(timePerFrame: number) {
        this.saveOldValues();
        this._physicEngine.update(timePerFrame);
        this.stoneSpinning(timePerFrame);
        this.calculateNewBoundingSphere();
    }

    private stoneSpinning(timePerFrame: number) {
        let rotationAngle = 2 * Math.PI * timePerFrame / Stone.SECONDS_PER_FULL_ROTATION;
        if (this.spin === StoneSpin.Clockwise) {
            this.rotateY(-rotationAngle);
        }
        else {
            this.rotateY(rotationAngle);
        }
    }

    private saveOldValues() {
        this._lastBoundingSphere = this._boundingSphere.clone();
        this._lastPosition = this.position.clone();
    }

    /**
     * Calculate the bounding sphere for collision and out of bounds detection.
     * Only call this function if the position is manually changed.
     */
    public calculateNewBoundingSphere() {
        this._boundingSphere.set(this.position, Stone.BOUNDING_SPHERE_RADIUS);
    }

    public changeStoneOpacity() {
        this.traverse((child) => {
            (<THREE.Mesh>child).material.transparent = true;
            (<THREE.Mesh>child).material.opacity = 1;
        });

        let observable = new Observable(() => {
            let millisecond = 0;
            let id = setInterval(() => {

                this.traverse((child) => {
                    if ((<THREE.Mesh>child).material.opacity > 0) {
                        (<THREE.Mesh>child).material.opacity -= 0.01;
                    }
                });
                millisecond += Stone.TEN_MILLISECONDS;
                if (millisecond === Stone.ONE_SECOND) {
                    clearTimeout(id);
                }
            }, Stone.TEN_MILLISECONDS);
        });
        return observable;
    }

    public bounce() {

        let incrementBounce = (Math.random() * (Stone.UPPER_BOUNCE_INCREMENT_BOUND
            - Stone.LOWER_BOUNCE_INCREMENT_BOUND)) + Stone.LOWER_BOUNCE_INCREMENT_BOUND;

        let upperBound = Math.floor(Math.random() * (Stone.UPPER_BOUNCE_BOUND
            - Stone.LOWER_BOUNCE_BOUND)) + Stone.LOWER_BOUNCE_BOUND;
        let lowerBound = 0;

        let observer = {
            next: (v: number) => { // Do not remove unused parameter
                if (this.position.y > upperBound) {
                    incrementBounce = -incrementBounce;
                } else if (this.position.y < lowerBound) {
                    incrementBounce = -incrementBounce;
                }
                this.position.y += incrementBounce;
            },
            complete: () => {
                this.changeStoneOpacity().subscribe();
            }
        };
        return observer;
    }
}
