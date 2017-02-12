//import * as express from 'express';

let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://sudoku23:log2990-23@ds147599.mlab.com:47599/sudoku';

export class DatabaseManager {

    public static async addUser(body: any): Promise<boolean> {
        if (body.username === '') {
            return false;
        }
        else {
            console.log("-- DatabaseManager addUser --");
            let db = await MongoClient.connect(url);
            let isInserted = false;
            try {
                let collection = db.collection('username');
                (await collection.insertOne(body).then((result: any) => {
                    if (result.insertedCount === 1) {
                        isInserted = true;
                        console.log("-- user inserted --");
                    }
                    else {
                        console.log("-- user not inserted --");
                    }
                }));
            } finally {
                db.close();
            }
            return isInserted;
        }
    }

    public static async removeUser(body: any): Promise<boolean> {
        if (body.username === '') {
            return false;
        }
        else {
            console.log("-- DatabaseManager removeUser --");
            let db = await MongoClient.connect(url);
            let isRemoved = false;
            try {
                let collection = db.collection('username');
                console.log(body);
                (await collection.deleteOne(body).then((result: any) => {
                    console.log(result.deletedCount);
                    if (result.deletedCount === 1) {
                        isRemoved = true;
                        console.log("-- user removed --");
                    }
                    else {
                        console.log("-- user not removed --");
                    }
                }));
            } finally {
                db.close();
            }
            console.log("-- isRemoved ", isRemoved);
            return isRemoved;
        }
    }

    public static async getTopRecords(): Promise<Array<Array<any>>> {
        try {
            console.log("-- DatabaseManager getTopRecords --");
            let db = await MongoClient.connect(url);
            let docs = new Array<any>();
            try {
                let collection = db.collection('leaderboard');
                docs.push(await collection.find({difficulty: "NORMAL"}).sort({time: 1}).limit(3).toArray());
                docs.push(await collection.find({difficulty: "HARD"}).sort({time: 1}).limit(3).toArray());
            } finally {
                db.close();
            }
            return docs;
        } catch (error) {
            console.log('ERROR - connexion a la db. - DatabaseManager getAllRecords');
            return null;
        }
    }

    public static async saveGameRecord(body: any): Promise<boolean> {
        let isInserted = false;
        let db = await MongoClient.connect(url);
        try {
            console.log("-- DatabaseManager saveGameRecord --");
            let collection = db.collection('leaderboard');
            (await collection.insertOne(body).then((result: any) => {
                if (result.insertedCount === 1) {
                    isInserted = true;
                    console.log("-- game record inserted --");
                }
                else {
                    console.log("-- game record not inserted --");
                }
            }));
        } finally {
            db.close();
        }
        return isInserted;
    }
}
