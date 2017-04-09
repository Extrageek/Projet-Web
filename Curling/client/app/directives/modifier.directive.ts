import { Directive, Input } from "@angular/core";
import { RenderService } from "../services/game-handler/render.service";

@Directive({
    selector: "modifier"
})
export class ModifierDirective {

    private _initCalled: boolean;

    constructor(private _renderService: RenderService) {
        this._initCalled = false;
    }

    @Input()
    public set container(value: HTMLElement) {
        if (!this._initCalled && value) {
            this._initCalled = true;
            this._renderService.init(value);
        }
    }
}
