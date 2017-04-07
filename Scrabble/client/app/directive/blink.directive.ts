import { Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Directive({ selector: '[blinking]' })
export class BlinkDirective implements OnInit {
    @Input("blinking") duration: number;

    constructor(private element: ElementRef, private renderer: Renderer) {}

    ngOnInit() {
        setInterval((() => {
            let style = "hidden";
            if (this.element.nativeElement.style.visibility
                && this.element.nativeElement.style.visibility === "hidden") {
                    style = "visible";
            }
            this.renderer.setElementStyle(this.element.nativeElement, 'visibility', style);
        }), this.duration);
    }
}
