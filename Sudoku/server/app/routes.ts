import * as express from 'express';

import * as puzzleManagerService from './services/puzzle-manager.service';
import { DatabaseManager } from './database-management';

module Route {

  export class RouteManager {
    puzzleManagerService : puzzleManagerService.PuzzleManager;
    _databaseManager: DatabaseManager;

    /**
     * The default constructor
     *
     * @class RouteManager
     */
    constructor() {
      // Default constructor
    }

     /**
     * The index function to render the main access page of the server ui.
     *
     * @class RouteManager
     * @method index
     * @return Server side main page
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      //res.sendFile(path.join(__dirname, '../dist/index.html'));
      res.send("Server Side Control Panel");
    }

    /**
     * The getNewPuzzle function, use the puzzle service to return a new puzzle.
     *
     * @class RouteManager
     * @method getNewPuzzle
     * @return newPuzzle
     */
    public getNewPuzzle(req: express.Request, res: express.Response, next: express.NextFunction) {

        // Get a new puzzle from the PuzzleManger service.
        let puzzleManager = new puzzleManagerService.PuzzleManager();
        let newPuzzle = puzzleManager.getNewPuzzle();

        res.send(newPuzzle);
    }

        public async addUser(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                await DatabaseManager.addUser(request.body)
                    .then((result: any) => {
                        if (result === true) {
                            response.sendStatus(HttpStatus.SUCCESS);
                        }
                        else {
                            response.sendStatus(HttpStatus.ERROR);
                        }
                    }).catch((error: any) => {
                        console.log("--- ERROR ---", error);
                        response.sendStatus(HttpStatus.ERROR);
                    });
            } catch (error) {
                response.sendStatus(HttpStatus.ERROR);
            }
        }

        public async removeUser(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                await DatabaseManager.removeUser(request.body)
                    .then((result: any) => {
                        if (result === true) {
                            response.sendStatus(HttpStatus.SUCCESS);
                        }
                        else {
                            response.sendStatus(HttpStatus.ERROR);
                        }
                    }).catch((error: any) => {
                        console.log("--- ERROR removeUser ---", error);
                        response.sendStatus(HttpStatus.ERROR);
                    });
            } catch (error) {
                response.sendStatus(HttpStatus.ERROR);
            }
        }

        public async getAllRecords(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                let records: Array<any> = await DatabaseManager.getAllRecords();
                response.status(records === null ? HttpStatus.ERROR : HttpStatus.SUCCESS).send(records);
            } catch (error) {
                response.status(HttpStatus.ERROR)
                    .send([{ "error": "Une erreur est survenue lors de la connexion a la base de donnees." }]);
            }
        }

        public async saveGameRecord(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                console.log("-- INDEX saveGameRecord --");
                await DatabaseManager.saveGameRecord(request.body)
                    .then((result: any) => {
                        if (result === true) {
                            console.log("-- INDEX saveGameRecord retour succes --");
                            response.sendStatus(HttpStatus.SUCCESS);
                        }
                        else {
                            console.log("-- INDEX saveGameRecord retour echec--");
                            response.sendStatus(HttpStatus.ERROR);
                        }
                    }).catch((error: any) => {
                        console.log("--- ERROR ---", error);
                    });
            } catch (error) {
                response.sendStatus(HttpStatus.ERROR);
            }
        }
    }
}

enum HttpStatus {
    ERROR = 400,
    SUCCESS = 200
}
export = Route;