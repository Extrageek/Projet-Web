import { Geometry, LineDashedMaterial, Line } from "three";
import { CameraService } from "../views/cameras.service";
import { ParticlesService } from "../game-physics/particles.service";
import { SoundManager } from "../sound-manager";
import { StoneHandler } from "../game-physics/stone-handler";
import { TextureHandler } from "../views/texture-handler";
import { UserService } from "../user.service";
import { RestApiProxyService } from "../rest-api-proxy.service";

export interface IGameServices {
    cameraService: CameraService;
    particlesService: ParticlesService;
    soundService: SoundManager;
    stoneHandler: StoneHandler;
    textureHandler: TextureHandler;
    userService: UserService;
    proxyService: RestApiProxyService;
}
