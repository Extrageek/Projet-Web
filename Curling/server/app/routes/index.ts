import * as express from 'express';

import { DatabaseManager } from '../database-management';

module Route {

  export class RouteManager {
    _databaseManager : DatabaseManager; 
    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send('Hello world');
    }

    public async addUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log(req.body);
        try {
            await DatabaseManager.addUser(req.body, res, next); 
        } catch (error) {
            res.status(400);
            res.send("Error: Route addUser");    
        }
        res.send();
    }

	public glComponent(req: express.Request, res: express.Response, next: express.NextFunction) {
	  res.redirect('/glcomp');
	}
	
  }
}

export = Route;
