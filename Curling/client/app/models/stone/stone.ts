import { ObjectLoader, Group, MeshPhongMaterial, Object3D, Sphere, Vector3 } from "three";
import { GameComponent } from "./gameComponent.interface";
import { StoneColor } from './stone-color';
import { StoneSpin } from './stone-spin';

export class Stone extends Group implements GameComponent {

    private static readonly STONES_PATH =
        ["/assets/models/json/curling-stone-red.json", "/assets/models/json/curling-stone-blue.json"];
    private static readonly BOUNDING_SPHERE_RADIUS = 0.26;
    private static readonly SCALE = {x: 1, y: 1, z: 1};
    private static readonly MATERIAL_PROPERTIES = {wireframe: false, shininess: 0.7};
    public static readonly SPEED_DIMINUTION_NUMBER = 0.2;
    public static readonly SPEED_DIMINUTION_NUMBER_WITH_SWEEP = 0.09;
    private static readonly MINIMUM_SPEED = 0.001;

    private _material: MeshPhongMaterial;
    private _stoneColor: StoneColor;
    //Speed orientation and quantity in meters per second
    private _speed: number;
    private _direction: Vector3;
    private _sweeping: boolean;
    private _spin: StoneSpin;
    //Bounding sphere used for collisions. Only works if the stones are displaced on the XZ plane.
    private _boundingSphere: Sphere;
    private _lastBoundingSphere: Sphere;
    private _lastPosition: Vector3;

    public static createStone(objectLoader: ObjectLoader, stoneColor: StoneColor,
        initialPosition: Vector3): Promise<Stone> {
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
        this._stoneColor = stoneColor;
        this._speed = 0;
        this._direction = new Vector3(0, 0, 1);
        this._spin = StoneSpin.Clockwise;
        this._boundingSphere = new Sphere(this.position, Stone.BOUNDING_SPHERE_RADIUS);
        this._lastBoundingSphere = this._boundingSphere;
        this._lastPosition = this.position;
    }

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

    public set position(position: Vector3) {
        this.position = position;
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(speed: number) {
        if (speed === null || speed === undefined || speed < 0) {
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
    }

    public revertToLastPosition() {
        this._boundingSphere = this._lastBoundingSphere;
        this.position.copy(this._lastPosition);
    }

    public update(timePerFrame: number) {
        if (this._speed !== 0) {
            this.saveOldValues();
            //Applying MRUA equation. Xf = Xi + V0*t + a*t^2 / 2, where t = timePerFrame, V0 = speed,
            //Xf is the final position, Xi is the initial position and a = -SPEED_DIMINUTION_NUMBER.
            this.position.add(this._direction.clone().multiplyScalar(
                this._speed * timePerFrame - Stone.SPEED_DIMINUTION_NUMBER * Math.pow(timePerFrame, 2) / 2));
            this.decrementSpeed(timePerFrame);
            this.calculateNewBoundingSphere();
        }
    }

    private saveOldValues() {
        this._lastBoundingSphere = this._boundingSphere.clone();
        this._lastPosition = this.position.clone();
    }

    private decrementSpeed(timePerFrame: number) {
        if (this._sweeping) {
            this._speed -= timePerFrame * Stone.SPEED_DIMINUTION_NUMBER_WITH_SWEEP;
        }
        else {
            this._speed -= timePerFrame * Stone.SPEED_DIMINUTION_NUMBER;
        }
        if (this._speed <= Stone.MINIMUM_SPEED) {
            this._speed = 0;
        }
    }

    private calculateNewBoundingSphere() {
        this._boundingSphere.set(this.position, Stone.BOUNDING_SPHERE_RADIUS);
    }
}
