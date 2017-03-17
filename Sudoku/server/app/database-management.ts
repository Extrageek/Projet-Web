//import * as express from 'express';

import { MongoClient, InsertOneWriteOpResult, DeleteWriteOpResultObject, Db } from "mongodb";
import { Difficulty } from "./models/puzzle";

export class DatabaseManager {

    private static readonly url = "mongodb://sudoku23:log2990-23@ds147599.mlab.com:47599/sudoku";
    private _dbConnection: Db;

    /**
     * Initialize a new database connection to interact with.
     * @return {Promise<DatabaseManager>} The promise will be rejected if an error occur when connecting to
     * the database. Otherwise, a DatabaseManager is returned when the promise resolve.
     */
    public static createDatabaseManager(): Promise<DatabaseManager> {
        return new Promise<DatabaseManager>((resolve, reject) => {
            MongoClient.connect(DatabaseManager.url)
                .then((db: Db) => {
                    resolve(new DatabaseManager(db));
                })
                .catch((reason: any) => {
                    reject(reason);
                });
        });
    }

    private constructor(dbConnection: Db) {
        this._dbConnection = dbConnection;
        console.log("passed here!");
        this._dbConnection.on("close", this.reconnectToDatabase.bind(this));
    }

    private reconnectToDatabase() {
        console.log("Trying to reconnect to database server...");
        MongoClient.connect(DatabaseManager.url)
            .then((db: Db) => {
                console.log("Reconnected succesfully.");
                this._dbConnection = db;
            })
            .catch((reason: any) => {
                console.log("Can't connect to the server. " + reason);
                console.log("Retrying in 30 seconds.");
                setTimeout(this.reconnectToDatabase.bind(this), 30000);
            });
    }

    public async addUser(body: any): Promise<boolean> {
        let isInserted = false;
        if (body.username !== "") {
            console.log("-- DatabaseManager addUser --");
            let collection = this._dbConnection.collection("username");
            await collection.insertOne(body)
                .then((result: InsertOneWriteOpResult) => {
                    if (result.insertedCount === 1) {
                        isInserted = true;
                        console.log("-- user inserted --");
                    }
                    else {
                        console.log("-- user not inserted --");
                    }
                })
                .catch((reason) => {
                    console.log("An exception occur while inserting user : " + reason);
                });
        }
        return isInserted;
    }

    public async removeUser(body: any): Promise<boolean> {
        let isRemoved = false;
        console.log("-- DatabaseManager removeUser --");
        let collection = this._dbConnection.collection("username");
        await collection.deleteOne(body)
            .then((result: DeleteWriteOpResultObject) => {
                if (result.deletedCount === 1) {
                    isRemoved = true;
                    console.log("-- user removed --");
                }
                else {
                    console.log("-- user not removed --");
                }
            })
            .catch((reason) => {
                console.log("An exception occur while removing user : " + reason);
            });
        return isRemoved;
    }

    public async getTopRecords(): Promise<Array<Array<any>>> {
        try {
            console.log("-- DatabaseManager getTopRecords --");
            let docs = new Array<any>();
            let collection = this._dbConnection.collection("leaderboard");
            docs.push(await collection.find({ difficulty: Difficulty.NORMAL }).sort({ time: 1 }).limit(3).toArray());
            docs.push(await collection.find({ difficulty: Difficulty.HARD }).sort({ time: 1 }).limit(3).toArray());
            return docs;
        }
        catch (error) {
            console.log("ERROR - connexion a la db. - DatabaseManager getAllRecords" + error);
            return null;
        }
    }

    public async saveGameRecord(body: any): Promise<boolean> {
        let isInserted = false;
            console.log("-- DatabaseManager saveGameRecord --");
            let collection = this._dbConnection.collection('leaderboard');
            await collection.insertOne(body)
                .then((result: InsertOneWriteOpResult) => {
                    if (result.insertedCount === 1) {
                        isInserted = true;
                        console.log("-- game record inserted --");
                    }
                    else {
                        console.log("-- game record not inserted --");
                    }
                })
                .catch((reason) => {
                    console.log("An exception occur while removing user : " + reason);
                });
        return isInserted;
    }
}
