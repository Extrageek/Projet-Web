//import * as express from 'express';

let MongoClient = require('mongodb').MongoClient;

let url = 'mongodb://curling23:log2990-23@ds117859.mlab.com:17859/curling';

export class DatabaseManager {

    static async addUser(body: any): Promise<boolean> {
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
                }));
            } finally {
                db.close();
            }
            console.log("-- isInserted ", isInserted);
            return isInserted;
        }
    }

    static async getAllRecords(): Promise<Array<any>> {
        try {
            let db = await MongoClient.connect(url);
            let docs: Array<any>;
            try {
                let collection = db.collection('leaderboard');
                docs = (await collection.find().toArray());
            } finally {
                db.close();
            }
            return docs;
        } catch (error) {
            console.log('ERROR - connexion a la db. - DatabaseManager getAllRecords');
            return null;
        }
    }

    static async saveGameRecord(body: any): Promise<boolean> {
        let isInserted = false;
        let db = await MongoClient.connect(url);
        try {
            let collection = db.collection('leaderboard');
            (await collection.insertOne(body).then((result: any) => {
                if (result.insertedCount === 1) {
                    isInserted = true;
                }
            }));
        } finally {
            db.close();
        }
        return isInserted;
    }
}
