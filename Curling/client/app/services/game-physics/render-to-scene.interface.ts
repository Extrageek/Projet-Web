import { Scene } from "three";

export interface RenderToScene {
    addToScene(scene: Scene): boolean;
    removeFromScene(scene: Scene): boolean;
}
