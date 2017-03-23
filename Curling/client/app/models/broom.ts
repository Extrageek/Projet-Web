import { ObjectLoader, Group, MeshPhongMaterial, Object3D, BoxGeometry, Vector3 } from "three";

export class Broom extends Group {

    private static readonly BROOM_PATH = ["/assets/models/json/broom-red.json"];
    private static readonly SCALE = { x: 0.4, y: 0.4, z: 0.4};
    private static readonly MATERIAL_PROPERTIES = { wireframe: false, shininess: 0.7 };

    private _material: MeshPhongMaterial;
    //Bounding sphere used for collisions. Only works if the stones are displaced on the XZ plane.
    private _boundingSquare: BoxGeometry;
    private _redBroom: Boolean;

    public static createBroom(objectLoader: ObjectLoader, initialPosition: Vector3): Promise<Broom> {
        return new Promise<Broom>((resolve, reject) => {
            objectLoader.load(
                Broom.BROOM_PATH[0],
                (obj: Object3D) => {
                    resolve(new Broom(obj, initialPosition));
                }
            );
        });
    }
    constructor(obj: Object3D, initialPosition: Vector3) {
        super();
        this.copy(<this>obj, true);
        this._material = new MeshPhongMaterial(Broom.MATERIAL_PROPERTIES);
        this.position.set(0, 0, -11.4);
        this.scale.set(Broom.SCALE.x, Broom.SCALE.y, Broom.SCALE.z);
        this._boundingSquare = new BoxGeometry(1, 1, 1);
        this._redBroom = true;
    }

    public changeToGreen() {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            (<THREE.MeshStandardMaterial>(<THREE.Mesh>child).material).emissive.setHex(0x00ff00);
        }
        this._redBroom = false;
    }

    public changeToRed() {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            (<THREE.MeshStandardMaterial>(<THREE.Mesh>child).material).emissive.setHex(0xff0000);
        }
        this._redBroom = true;
    }

    public isRed(): Boolean {
        return this._redBroom;
    }
}
