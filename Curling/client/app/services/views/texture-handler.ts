import { Scene, FontLoader, TextGeometry, MeshPhongMaterial, MultiMaterial, Mesh, Group, TextGeometryParameters, Font,
     Vector3 } from "three";

export class TextureHandler {

    private static readonly FONT_LOADER = new FontLoader();
    private static readonly HELVETIKER_FONT = "/assets/fonts/helvetiker_regular.typeface.json";
    private static readonly BEST_FONT = "/assets/fonts/best_font.typeface.json";

    private _defaultParameters: TextGeometryParameters;
    private _scene: Scene;
    private _allTexts: Object;
    private _textNumber: number;
    private _text: string;
    private _textMaterial: MultiMaterial;
    private _textGroup: Group;
    private _fontLoader: FontLoader;
    private _textMesh: Mesh;
    private _fontName: string;

    public static createTextureHandler(sceneToAddTextures: Scene, fontPath = TextureHandler.HELVETIKER_FONT)
        : Promise<TextureHandler> {
            return new Promise<TextureHandler>((resolve, reject) => {
            //The font parameter is supposed to be an object of font type. Typescript has a wrong callback parameter.
                TextureHandler.FONT_LOADER.load(fontPath,
                    (font: any) => {
                        resolve(new TextureHandler(sceneToAddTextures, font));
                    },
                    (event: any) => {
                        //Nothing to do
                    },
                    (event: any) => {
                        reject("Can't load the font!");
                    });
            });
    }

    private constructor(sceneToAddTextures: Scene, font: Font) {
        this._allTexts = {};
        this._textNumber = 0;
        this._scene = sceneToAddTextures;
        this._defaultParameters = {
            font: font,
            size: 1,
            height: 1,
            curveSegments: 12,
            bevelThickness: 0.005,
            bevelSize: 0.005,
            bevelEnabled: true
        };
    }

    public addText(position: Vector3, texte: string, textGeometryParameters = this._defaultParameters): number {
            //Create the text.
            let textGeometry = new TextGeometry(texte, textGeometryParameters);
            textGeometry.computeBoundingBox();
            let textMaterial = new MeshPhongMaterial({color: THREE.ColorKeywords.red});
            let textMesh = new Mesh(textGeometry, textMaterial);
            textMesh.rotation.set(0, Math.PI, 0);
            textMesh.position.set(position[0], position[1], position[2]);
            this._scene.add(textMesh);

            //Store the informations for future modifications.
            Object.defineProperty(this._allTexts, this._textNumber.toString(),
                {value: {"textGeometry": textGeometry, "textMaterial": textMaterial, "textMesh": textMesh}});

            //Return the identifier to permit future modifications.
            let identifier = this._textNumber;
            ++this._textNumber;
            console.log("text added");
            return identifier;
    }
}
