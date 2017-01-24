import * as express from 'express';

import { DatabaseManager } from '../database-management';

module Route {

  export class RouteManager {
    _databaseManager : DatabaseManager; 
    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send('Hello world');
    }

    public addUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        DatabaseManager.addUser(req.body, res, next);
    }

	public glComponent(req: express.Request, res: express.Response, next: express.NextFunction) {
	  res.redirect('/glcomp');
	}
	
  }
}

export = Route;
