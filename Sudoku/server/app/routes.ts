import * as express from "express";
import { GridGenerationManager } from "./services/grid-generation.service";
import { GridValidationManager } from "./services/grid-validation.service";
import { Puzzle } from "./models/puzzle";
import { Difficulty } from "./services/grid-generation.service";
import { DatabaseManager } from "./database-management";

module Route {

    export class RouteManager {

        private _gridGenerationManager: GridGenerationManager;
        private _databaseManager: DatabaseManager;

        constructor(gridGenerationManager: GridGenerationManager, databaseManager: DatabaseManager) {
            this._gridGenerationManager = gridGenerationManager;
            this._databaseManager = databaseManager;
        }

        /**
         * The index function to render the main access page of the server ui.
         *
         * @class RouteManager
         * @method index
         * @return Server side main page
         */
        public index(request: express.Request, res: express.Response, next: express.NextFunction) {
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
        public getNewPuzzle(request: express.Request, res: express.Response, next: express.NextFunction) {
            // Get a new puzzle from the PuzzleManger service.
            let difficulty = request.params.difficulty;
            if (!GridGenerationManager.isValidDifficulty(difficulty)) {
                difficulty = Difficulty.NORMAL;
            }
            this._gridGenerationManager.getNewPuzzle(difficulty)
                .then((newPuzzle: Puzzle) => {
                    res.send(newPuzzle);
                });
        }

        public async addUser(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                await this._databaseManager.addUser(request.body)
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
                await this._databaseManager.removeUser(request.body)
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

        public async getTopRecords(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                let records: Array<Array<any>> = await this._databaseManager.getTopRecords();
                response.status(records === null ? HttpStatus.ERROR : HttpStatus.SUCCESS).send(records);
            } catch (error) {
                response.status(HttpStatus.ERROR)
                    .send([{ "error": "Une erreur est survenue lors de la connexion a la base de donnees." }]);
            }
        }

        public async saveGameRecord(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                console.log("-- INDEX saveGameRecord --");
                await this._databaseManager.saveGameRecord(request.body)
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

        public validateGrid(request: express.Request, response: express.Response, next: express.NextFunction) {
            let gridValidationManager = new GridValidationManager();
            let isGridValid: boolean;
            try {
                isGridValid = gridValidationManager.validateGrid(request.body.puzzle);
            } catch (error) {
                isGridValid = false;
            }
            if (isGridValid) {
                response.send({ validity: "valid" });
            }
            else {
                response.send({ validity: "invalid" });
            }
        }
    }
}

enum HttpStatus {
    ERROR = 400,
    SUCCESS = 200
}
export = Route;
