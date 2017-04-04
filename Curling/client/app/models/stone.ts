import { ObjectLoader, Group, MeshPhongMaterial, Object3D, Sphere, Vector3, Matrix3 } from "three";
import { GameComponent } from "./game-component.interface";
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

export class Stone extends Group implements GameComponent {

    private static readonly STONES_PATH =
    ["/assets/models/json/curling-stone-blue.json", "/assets/models/json/curling-stone-red.json"];
    public static readonly THETA = Math.PI * 3 / 1250;
    private static readonly ONE_SECOND = 1000;
    private static readonly TEN_MILLISECONDS = 10;
    public static readonly BOUNDING_SPHERE_RADIUS = 0.26;
    private static readonly SCALE = { x: 1, y: 1, z: 1 };
    private static readonly MATERIAL_PROPERTIES = { wireframe: false, shininess: 0.7 };
    public static readonly SPEED_DIMINUTION_NUMBER = 0.25;
    public static readonly SPEED_DIMINUTION_NUMBER_WITH_SWEEP = 0.09;
    private static readonly MINIMUM_SPEED = 0.001;
    private static readonly SECONDS_PER_FULL_ROTATION = 4;
    //private static readonly SWEEPING_CURL_COEFF = 0.0001;

    public _material: MeshPhongMaterial;
    private _stoneColor: StoneColor;
    //Speed orientation and quantity in meters per second
    private _speed: number;
    private _direction: Vector3;
    private _sweeping: boolean;
    private _spin: StoneSpin;
    private _thetaPerFrame: number;
    //Bounding sphere used for collisions. Only works if the stones are displaced on the XZ plane.
    private _boundingSphere: Sphere;
    private _lastBoundingSphere: Sphere;
    private _lastPosition: Vector3;
    private _curlMatrix: Matrix3;

    public get boundingSphere(): Sphere {
        return this._boundingSphere;
    }

    //Used by the renderer to get the material of the group.
    public get material() {
        return this._material;
    }

    public get stoneColor() {
        return this._stoneColor;
    }

    public get isSweeping(): boolean {
        return this._sweeping;
    }

    public set sweeping(sweep: boolean) {
        this._sweeping = sweep;
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(speed: number) {
        if (speed == null || speed === undefined || speed < 0) {
            throw new Error("The speed cannot be null or less than 0.");
        }
        this._speed = speed;
    }

    public get direction(): Vector3 {
        return this._direction;
    }

    public set direction(direction: Vector3) {
        if (direction === null || direction === undefined) {
            throw new Error("The direction is not a valid vector.");
        }
        this._direction = direction.normalize();
    }

    public get spin(): StoneSpin {
        return this._spin;
    }

    public set spin(s: StoneSpin) {
        this._spin = s;
        this._thetaPerFrame = Stone.THETA * (this._spin === StoneSpin.Clockwise ? -1 : 1);
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
        this._material = new MeshPhongMaterial(Stone.MATERIAL_PROPERTIES);
        this.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        this.scale.set(Stone.SCALE.x, Stone.SCALE.y, Stone.SCALE.z);
        this.sweeping = false;
        this._stoneColor = stoneColor;
        this._speed = 0;
        this._direction = new Vector3(0, 0, 1);
        this._spin = StoneSpin.Clockwise;
        this._boundingSphere = new Sphere(this.position, Stone.BOUNDING_SPHERE_RADIUS);
        this._lastBoundingSphere = this._boundingSphere;
        this._lastPosition = this.position;
        this._curlMatrix = new Matrix3();
    }

    public revertToLastPosition() {
        this._boundingSphere = this._lastBoundingSphere;
        this.position.copy(this._lastPosition);
    }

    public update(timePerFrame: number) {
        if (this._speed !== 0) {
            this.saveOldValues();
            this.calculateCurlMatrix(this._thetaPerFrame * timePerFrame);
            //Applying MRUA equation. Xf = Xi + V0*t + a*t^2 / 2, where t = timePerFrame, V0 = speed,
            //Xf is the final position, Xi is the initial position and a = -SPEED_DIMINUTION_NUMBER.
            //CurlMatrix is applied to the MRUA equaion to add a spin effect
            this.position.add((this._direction.applyMatrix3(this._curlMatrix).clone()
                .multiplyScalar(this._speed * timePerFrame - Stone.SPEED_DIMINUTION_NUMBER
                * Math.pow(timePerFrame, 2) / 2)
            ));
            this.position.y = 0;
            this.stoneSpinning(timePerFrame);
            this.decrementSpeed(timePerFrame);
            this.calculateNewBoundingSphere();
        }
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

    private decrementSpeed(timePerFrame: number) {
        if (this._sweeping) {
            this._speed -= timePerFrame * Stone.SPEED_DIMINUTION_NUMBER_WITH_SWEEP;
            this._sweeping = false;
        }
        else {
            this._speed -= timePerFrame * Stone.SPEED_DIMINUTION_NUMBER;
        }
        if (this._speed <= Stone.MINIMUM_SPEED) {
            this._speed = 0;
        }
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

        let observable = new Observable((observer: any) => {
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


    private calculateCurlMatrix(theta: number) {
        this._curlMatrix.set(
            Math.cos(theta), 0, Math.sin(theta),
            0, 1, 0,
            -Math.sin(theta), 0, Math.cos(theta));
    }
}
