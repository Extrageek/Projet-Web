import { Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Directive({ selector: '[blinking]' })
export class BlinkDirective implements OnInit {
    @Input("blinking") duration: number;

    constructor(private element: ElementRef, private renderer: Renderer) {}

    ngOnInit() {
        setInterval((() => {
            let style = "0";
            if (this.element.nativeElement.style.opacity
                && this.element.nativeElement.style.opacity === "0") {
                    style = "1";
            }
            this.renderer.setElementStyle(this.element.nativeElement, 'opacity', style);
        }), this.duration);
    }
}
