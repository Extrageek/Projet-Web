import { RouteManager } from './index';
import { expect } from 'chai';

describe("A Route Manager should ", () => {
    it("allow to play with a valid username", done => {
        let route = new RouteManager();
        let user: [{username: "Michel"}];
        //  expect(route.addUser(user);).to.equal(true);
        //route.addUser({username: "rami"};
        //expect()).to.equal(expectedId);
        //done();
    });
    it("prevent to play with an invalid username", done => {
        done();
    });
    it("react to an error to a username", done => {
        //
    });
    it("get all records with succes", done => {
        //
    });
    it("react to an error when getting records", done => {
        //
    });
    it("allow to save a game correctly", done => {
        //
    });
    it("prevent to quit without saving correctly", done => {
        //
    });
    it("react to an error when saving", done => {
        //
    });
});
