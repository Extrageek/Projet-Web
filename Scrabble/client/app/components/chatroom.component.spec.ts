import { expect } from 'chai';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ChatroomComponent } from './chatroom.component';

describe("Chatroom testing the event handlers", () => {
    let comp: ChatroomComponent;
    let fixture: ComponentFixture<ChatroomComponent>;
    let de: DebugElement;

    // async beforeEach
    beforeEach(async (() => {
        TestBed.configureTestingModule({
            declarations: [ ChatroomComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatroomComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
  });

    it("should initialize a chatroom with zero messages", () => {
        expect(comp.messageArray).to.have.lengthOf(0);
    });

    it("should add a text message into the message array", () => {
        let inputMessageElement = de.query(By.css("#inputMessage"));
        inputMessageElement.nativeElement.value = "hello";
        fixture.detectChanges();
        inputMessageElement.triggerEventHandler('keyup.enter', null);
        expect(comp.messageArray).to.have.lengthOf(1);
        expect(comp.messageArray[0]).to.contain("hello");
    });
});
