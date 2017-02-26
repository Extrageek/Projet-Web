import { GridGenerationManager } from "./grid-generation.service";

export class ServiceGetter {

    private static gridGenerationManager: GridGenerationManager;
    private static servicesInitialized = false;

    public static initializeService() {
        if (!ServiceGetter.servicesInitialized) {
            ServiceGetter.gridGenerationManager = new GridGenerationManager();
            ServiceGetter.servicesInitialized = true;
        }
    }

    public static getGridGenerationManager(): GridGenerationManager {
        return ServiceGetter.gridGenerationManager;
    }
}
