import { ObjectLoader, Group, MeshPhongMaterial, Object3D, Sphere, Vector3 } from "three";
import { GameComponent } from "./gameComponent.interface";

export enum StoneColor {
    Red = 0,
    Blue,
    NumberOfColors
}

export class Stone extends Group implements GameComponent {

    private static readonly STONES_PATH =
        ["/assets/models/json/curling-stone-red.json", "/assets/models/json/curling-stone-blue.json"];
    private static readonly BOUNDING_SPHERE_RADIUS = 1;
    private static readonly SCALE = {x: 1, y: 1, z: 1};
    private static readonly MATERIAL_PROPERTIES = {wireframe: false, shininess: 0.7};
    private static readonly SPEED_DIMINUTION_RATIO = 0.99;
    private static readonly SPEED_DIMINUTION_RATIO_WITH_SWEEP = 0.995;
    private static readonly MINIMUM_SPEED = 0.03;

    private _material: MeshPhongMaterial;
    private _stoneColor: StoneColor;
    //Speed orientation and quantity in meters per second
    private _speed: Vector3;
    //Bounding sphere used for collisions. Only works if the stones are displaced on the XZ plane.
    private _boundingSphere: Sphere;
    private _sweeping: boolean;

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
        this._speed = new Vector3();
        this._boundingSphere = new Sphere(this.position, Stone.BOUNDING_SPHERE_RADIUS);
    }

    public get boundingSphere(): Sphere {
        return this._boundingSphere;
    }

    public get material() {
        return this._material;
    }

    public get stoneColor() {
        return this._stoneColor;
    }

    public set sweeping(sweep: boolean) {
        this._sweeping = sweep;
    }

    public set position(position: Vector3) {
        this.position = position;
    }

    public get speed(): Vector3 {
        return this._speed;
    }

    public set speed(speed: Vector3) {
        if (speed === null || speed === undefined) {
            throw new Error("The speed vector cannot be null.");
        }
        this._speed = speed;
    }

    public update(timePerFrame: number) {
        //TODO : Make the physic movement here
        if (this._speed.length() !== 0) {
            this.position.add(this._speed.clone().multiplyScalar(timePerFrame));
            if (this._sweeping) {
                this._speed.multiplyScalar(Stone.SPEED_DIMINUTION_RATIO_WITH_SWEEP);
            }
            else {
                this._speed.multiplyScalar(Stone.SPEED_DIMINUTION_RATIO);
            }
            if (this._speed.length() <= Stone.MINIMUM_SPEED) {
                this._speed.set(0, 0, 0);
            }
        }
    }
}
