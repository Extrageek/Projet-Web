import { Injectable } from "@angular/core";
import { Scene, SpotLight } from "three";

@Injectable()
export class LightingService {
    public setUpLighting(scene: Scene) {
        let spotlightHouseNear = new SpotLight(0xffffff, 0.5, 0, 0.4);
        spotlightHouseNear.penumbra = 0.34;
        spotlightHouseNear.position.set(9, 10, -17);
        spotlightHouseNear.target.position.set(0, 0, -17);
        scene.add(spotlightHouseNear.target);
        scene.add(spotlightHouseNear);

        let spotlight1 = new SpotLight(0xffffff, 0.7, 0, 0.4);
        spotlight1.penumbra = 0.39;
        spotlight1.position.set(9, 10, -7);
        spotlight1.target.position.set(0, 0, -10);
        scene.add(spotlight1.target);
        scene.add(spotlight1);

        let spotlight2 = new SpotLight(0x3333cc, 0.8, 0, 0.2);
        spotlight2.penumbra = 0.7;
        spotlight2.position.set(-19, 10, 4);
        spotlight2.target.position.set(0, 0, 0);
        scene.add(spotlight2.target);
        scene.add(spotlight2);

        let spotlight3 = new SpotLight(0xff3333, 0.6, 0, 0.2);
        spotlight3.penumbra = 0.45;
        spotlight3.position.set(19, 10, 12);
        spotlight3.target.position.set(0, 0, 8);
        scene.add(spotlight3.target);
        scene.add(spotlight3);

        let spotlightHouseFar = new SpotLight(0xffffff, 0.8, 0, 0.4);
        spotlightHouseFar.penumbra = 0.34;
        spotlightHouseFar.position.set(-9, 10, 17);
        spotlightHouseFar.target.position.set(0, 0, 17);
        scene.add(spotlightHouseFar.target);
        scene.add(spotlightHouseFar);

        let spotlight4 = new SpotLight(0xffffff, 0.6, 0, 0.3);
        spotlight4.penumbra = 0.8;
        spotlight4.position.set(9, 10, 12);
        spotlight4.target.position.set(0, 0, 23);
        scene.add(spotlight4.target);
        scene.add(spotlight4);
    }
}
