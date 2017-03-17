import { Injectable } from "@angular/core";
import { Scene, PerspectiveCamera, WebGLRenderer, Renderer, ObjectLoader, FontLoader, Geometry, CubeGeometry,
    TextGeometry, MeshBasicMaterial, MeshFaceMaterial, MeshPhongMaterial, MultiMaterial, Mesh, SpotLight, Group,
    Font, ImageUtils, BackSide, FlatShading, SmoothShading, Vector3, Clock } from "three";

@Injectable()
export class TextureService {
    private _font: Font;
    private _text: string;
    private _textMaterial: MultiMaterial;
    private _textGroup: Group;
    private _fontLoader: FontLoader;
    private _textMesh: Mesh;
    private _fontName: string;

    // Load the font
    public loadFont(scene: Scene) {
        this._fontLoader = new FontLoader();
        this._textMaterial = new MultiMaterial([
            new MeshPhongMaterial({ shading: FlatShading }), // front
            new MeshPhongMaterial({ shading: SmoothShading })
        ]
        );
        this._textGroup = new Group();
        this._textGroup.position.y = 100;
        scene.add(this._textGroup);
        this._fontName = 'helvetiker_regular';
    }

    /* This version loads the font each time, not efficient ! */
    slowCreateText(scene: Scene) {
        console.log(this);
        this._fontLoader.load('/assets/fonts/helvetiker_regular.typeface.json', r => {
            scene.remove(this._textGroup);
            this._textGroup.remove(this._textMesh);
            this._font = new Font(r);
            let f = Object(r);

            let textGeo: TextGeometry = new TextGeometry(this._text, {
                font: f as Font,
                size: 20,
                height: 20,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: false
            });
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            let centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
            this._textMesh = new Mesh(textGeo, this._textMaterial);
            // this._textMesh.position.x = centerOffset;
            // this._textMesh.position.y = 50;
            // this._textMesh.position.z = 0;
            // this._textMesh.rotation.x = 0;
            // this._textMesh.rotation.y = Math.PI * 2;
            this._textGroup.add(this._textMesh);
            scene.add(this._textGroup);
        });
    }

    private refreshText(scene: Scene) {
        this.slowCreateText(scene);
    }

    public setText(newText: string, scene: Scene) {
        this._text = newText;
        this.refreshText(scene);
    }
}
