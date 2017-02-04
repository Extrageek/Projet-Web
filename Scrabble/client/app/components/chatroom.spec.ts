import { expect, assert } from 'chai';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ChatroomComponent } from './chatroom.component';
describe("Chatroom testing the event handlers", () => {
    let comp: ChatroomComponent;
    let fixture: ComponentFixture<ChatroomComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    // async beforeEach
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ChatroomComponent ], // declare the test component
        })
            .compileComponents();  // compile template and css
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(ChatroomComponent);

        comp = fixture.componentInstance; // BannerComponent test instance

        // query for the title <h1> by CSS element selector
        de = fixture.debugElement.query(By.css('h1'));
        el = de.nativeElement;
    });


    it('true is true', () => expect(true).to.be.true);



});
