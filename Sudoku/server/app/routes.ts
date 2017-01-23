import * as express from 'express';

import * as puzzleManagerService from './services/puzzle-manager.service';

module Route {

  export class RouteManager  {
    puzzleManagerService : puzzleManagerService.PuzzleManager;

    /**
     * The default constructor
     *
     * @class RouteManager
     */
    constructor() { }

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
        let puzzleManager =  new puzzleManagerService.PuzzleManager()
        let newPuzzle = puzzleManager.getNewPuzzle();

        res.send(newPuzzle);
    }
  }

}

export = Route;
