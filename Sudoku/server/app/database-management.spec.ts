import { DatabaseManager } from './database-management';
import { expect } from 'chai';

describe("DatabaseManager", () => {
    // addUser
    it("addUser should allow to add a valid username", async done => {
        await expect(DatabaseManager.addUser({ username: "julien" }).should.be.true);
        done();
    });

    it("addUser should revoke the insertion an username already present in the db.", async done => {
        await expect(DatabaseManager.addUser({ username: "julien" }).should.be.false);
        done();
    });

    it("addUser should denied insertion because an empty username.", async done => {
        await expect(DatabaseManager.addUser({ username: "" }).should.be.false);
        done();
    });

    // REMOVE USER
    it("remove user should allow to add a valid username", async done => {
        await expect(DatabaseManager.removeUser({ username: "julien" }).should.be.true);
        done();
    });

    it("remove user should do nothing if the username doesnt exist in the db.", async done => {
        await expect(DatabaseManager.removeUser({ username: "gggggggzzzzzzzz" }).should.be.false);
        done();
    });

    it("remove user should denied the insertion because an empty username.", async done => {
        await expect(DatabaseManager.removeUser({ username: "" }).should.be.false);
        done();
    });
    
    // REMOVE USER
    it("remove user should allow to add a valid username", async done => {
        await expect(DatabaseManager.removeUser({ username: "julien" }).should.be.true);
        done();
    });

    it("remove user should do nothing if the username doesnt exist in the db.", async done => {
        await expect(DatabaseManager.removeUser({ username: "gggggggzzzzzzzz" }).should.be.false);
        done();
    });

    it("remove user should denied the insertion because an empty username.", async done => {
        await expect(DatabaseManager.removeUser({ username: "" }).should.be.false);
        done();
    });

    
    // REMOVE USER
    it("saveGameRecord user should allow to add a valid username", async done => {
        await expect(DatabaseManager.removeUser({ username: "julien"}).should.be.true);
        done();
    });

    it("saveGameRecord should do nothing if the username doesnt exist in the db.", async done => {
        await expect(DatabaseManager.removeUser({ username: "gggggggzzzzzzzz" }).should.be.false);
        done();
    });

    it("saveGameRecord user should denied the insertion because an empty username.", async done => {
        await expect(DatabaseManager.removeUser({ username: "" }).should.be.false);
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


