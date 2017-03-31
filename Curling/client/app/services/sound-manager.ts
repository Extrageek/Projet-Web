import { Audio, AudioListener, AudioLoader, AudioBuffer } from "three";

export class SoundManager {
    private static _instance: SoundManager;
    private _listener: AudioListener;
    // Cannot put audio in vector because of promises
    private _broomInSound: Audio;
    private _broomOutSound: Audio;
    private _collisionSound: Audio;


    private _audioLoader: AudioLoader;

    constructor() {
        this._listener = new AudioListener();
        this._audioLoader = new AudioLoader();


        this.addSound("../assets/sounds/collisionHit.wav").then((retrievedSound: Audio) => {
            this._collisionSound = retrievedSound;
        });

        this.addSound("../assets/sounds/broomIn.wav").then((retrievedSound: Audio) => {
            this._broomInSound = retrievedSound;
        });

        this.addSound("../assets/sounds/broomOut.wav").then((retrievedSound: Audio) => {
            this._broomOutSound = retrievedSound;
        });
    }

    get broomOutSound(): THREE.Audio {
        this._broomOutSound.isPlaying = false;
        return this._broomOutSound.play();
    }

    get broomInSound(): THREE.Audio {
        this._broomInSound.isPlaying = false;
        return this._broomInSound.play();
    }

    get collisionSound(): THREE.Audio {
        this._collisionSound.isPlaying = false;
        return this._collisionSound.play();
    }

    public static getInstance(): SoundManager {
        if (SoundManager._instance === null || SoundManager._instance === undefined) {
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance;
    }

    get listener(): THREE.AudioListener {
        return this._listener;
    }

    private addSound(soundPath: string): Promise<Audio> {
        return new Promise<Audio>((resolve, reject) => {
            this._audioLoader.load(soundPath, (buffer: AudioBuffer) => { // On load
                    let newSound = new Audio(this._listener);
                    newSound.setBuffer(buffer);
                    newSound.setLoop(false);
                    resolve(newSound);
                }, () => {
                }, // On progress
                () => { // On error
                    console.error("Sound not found, unable to load");
                })
        });

    }
}


