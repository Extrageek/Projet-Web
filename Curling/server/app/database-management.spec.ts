import { DatabaseManager } from './database-management';
import { expect } from 'chai';

describe("A DatabaseManager should", () => {
     before(() => {
        //let route = new DatabaseManager();
    });

     it("allow to play with a valid username", done => {
        let body = [{username: "rami"}];
        expect(DatabaseManager.addUser(body).should.equal(true));
        done();
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


