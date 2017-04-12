import { Geometry, Vector3, Scene, PointsMaterial, Points } from "three";
import { IGameInfo } from "./../game-handler/game-info.interface";

export class ParticlesService {

    private readonly PARTICLES_COUNT = 1800;
    private _geometry: Geometry;
    private _material: PointsMaterial;
    private _particleSystem: Points;
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
        this._geometry = new THREE.Geometry();
        this._material = new THREE.PointsMaterial({
            size: 0.5,
            color: 0x00AAFF
        });
        this.createParticles();
    }

    private createParticles() {
        for (let count = 0; count < this.PARTICLES_COUNT; ++count) {
            this.setConffetiColors();
            //this._particleSystem.children
            this.setConffetiPosition();
        }
        this._particleSystem = new THREE.Points(this._geometry, this._material);
    }

    private setConffetiColors() {
        this._geometry.colors = [
            new THREE.Color(this.randomColor()),
            new THREE.Color(this.randomColor()),
            new THREE.Color(this.randomColor()),
            new THREE.Color(this.randomColor()),
            new THREE.Color(this.randomColor())
        ];

        //setHSL(Math.random() * 360, 100, 50);
        // let hexColor = Number('0x' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6));
        // this._material = new PointsMaterial({
        //     color: hexColor
        // });
    }

    private randomColor(): number {
        return Math.floor(Math.random() * 16777215);
    }

    private setConffetiPosition() {
        let positionAxisX = Math.random() * 100 - 50;
        let positionAxisY = Math.random() * 8 - 5;
        let positionAxisZ = Math.random() * 100 - 50;
        this._geometry.vertices.push(new THREE.Vector3(positionAxisX, positionAxisY, positionAxisZ));
    }

    public update() {
        //this._particleSystem.rotation.x += 0.01;

        this._particleSystem.children.map((particle) => {
            if (particle.position.y >= 5) {
                particle.translateY(-0.01);
            }
        });

        //this._particleSystem.rotation.y += 0.01;
        //this._particleSystem.rotation.z += 0.01;

        // if (this._particleSystem.position.y > 0) {
        //     this._particleSystem.position.set(
        //         this._particleSystem.position.x,
        //         this._particleSystem.position.y -= 0.1,
        //         this._particleSystem.position.z);
        // } else {
        //     this._particleSystem.position.set(
        //         this._particleSystem.position.x,
        //         0,
        //         this._particleSystem.position.z);
        // }
    }

    public addParticulesToScene() {
        this._scene.add(this._particleSystem);
    }

    public removeParticulesFromScene() {
        this._scene.remove(this._particleSystem);
    }
}
