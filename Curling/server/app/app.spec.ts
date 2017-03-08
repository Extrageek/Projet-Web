import { Application } from './app';
import { expect } from 'chai';

describe("An Application should", () => {
    it("create an application service correctly", done => {
        expect(() => { new Application(); }).to.not.throw(Error);
        done();
    });
});
