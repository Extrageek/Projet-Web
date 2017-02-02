import * as express from 'express';

import { DatabaseManager } from '../database-management';

module Route {
  export class RouteManager {
    _databaseManager: DatabaseManager;

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send('Hello world');
    }

    public async addUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            await DatabaseManager.addUser(req.body)
            .then(response => {
                if(response === true){
                    res.sendStatus(HttpStatus.SUCCESS);
                }
                else{
                    res.sendStatus(HttpStatus.ERROR);
                }
            }).catch(error => {
                console.log("--- ERROR ---", error)
            }); 
        } catch (error) {
            res.sendStatus(HttpStatus.ERROR);   
        }
    }

    public async getAllRecords(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let records: Array<any> = await DatabaseManager.getAllRecords();
            res.status(records === null ? HttpStatus.ERROR : HttpStatus.SUCCESS).send(records);
        } catch (error) {
            res.status(HttpStatus.ERROR).send([{"error" : "Une erreur est survenue lors de la connexion a la base de donnees. (getAllRecords)"}]);   
        }
    }

    public async saveGameRecord(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            console.log("-- INDEX saveGameRecord --");
            await DatabaseManager.saveGameRecord(req.body)
            .then(response => {
                if(response === true){
                    console.log("-- INDEX saveGameRecord retour succes --");
                    res.sendStatus(HttpStatus.SUCCESS);
                }
                else{
                    console.log("-- INDEX saveGameRecord retour echec--");
                    res.sendStatus(HttpStatus.ERROR);
                }
            }).catch(error => {
                console.log("--- ERROR ---", error)
            }); 
        } catch (error) {
            res.sendStatus(HttpStatus.ERROR);   
        }
    }

    public glComponent(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.redirect('/glcomp');
    }
  }
}

enum HttpStatus{
    ERROR = 400,
    SUCCESS = 200
}

export = Route;
