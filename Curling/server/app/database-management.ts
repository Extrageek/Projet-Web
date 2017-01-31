import * as express from 'express';

var MongoClient = require('mongodb').MongoClient;

let url: string = 'mongodb://curling23:log2990-23@ds117859.mlab.com:17859/curling';

export class DatabaseManager {

    static async addUser(body: any): Promise<boolean> {
        if (body.username === '') {
            return false;
        }
        else {
            let db = await MongoClient.connect(url);
            let isInserted: boolean = false;
            try {
                let collection = db.collection('username');
                (await collection.insertOne(body).then((result: any) => {
                    if (result.insertedCount === 1) {
                        isInserted = true;
                    }
                }));
            } finally {
                db.close();
                return isInserted;
            }
        }
    };

    static async getAllRecords(): Promise<Array<any>> {
        try {
            let db = await MongoClient.connect(url);
            let docs: Array<any>;
            try {
                let collection = db.collection('leaderboard');
                docs = (await collection.find().toArray());
            } finally {
                db.close();
                return docs;
            }
        } catch (error) {
            console.log('ERROR - connexion a la db. - DatabaseManager getAllRecords');
            return null;
        }
    }

    static async saveGameRecord(body: any): Promise<boolean> {
        let isInserted: boolean = false;
        if (body.username === '') {
            return isInserted;
        }
        else {
            let db = await MongoClient.connect(url);
            try {
                let collection = db.collection('username');
                (await collection.insertOne(body).then((result: any) => {
                    if (result.insertedCount === 1) {
                        isInserted = true;
                    }
                }));
            } finally {
                db.close();
                return isInserted;
            }
        }
    };
}
