import { AppComponent } from './app.component';
import {
    async, ComponentFixture, TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { expect } from 'chai';
import { HttpModule } from "@angular/http";


describe('AppComponent', function () {
    let de: DebugElement;
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [AppComponent],
            imports: [FormsModule, HttpModule],
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(AppComponent);
            comp = fixture.componentInstance;
        });

        it('should have expected <h1> text', () => {
            de = fixture.debugElement.query(By.css('h1'));
            fixture.detectChanges();
            const h1 = de.nativeElement;
            expect(h1.innerText).to.match(/SUDOCUL/i,
                '<h1> should say something about "Angular"');
        });
    });
});
