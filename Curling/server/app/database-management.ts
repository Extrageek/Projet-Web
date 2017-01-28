import * as express from 'express';

var mongodb = require('mongojs');

var db = mongodb('mongodb://curling23:log2990-23@ds117859.mlab.com:17859/curling', ['username']);

export class DatabaseManager {

    // GET: api/tasks - for all the tasks
    //[req: request, res: response]
    static addUser(body : any, res: express.Response, next: express.NextFunction){
        let user = body;
        // Send an error task is empty
        if(user.username === '')
        {
            res.status(400);
            res.statusMessage = "username vide"; 
        }
        else{
            // Save the task if everything is find
            db.username.save(body, (err: any, body: any) =>{
                if (err){
                    res.status(400);
                    res.statusMessage = "username existing";
                    console.log('username existing');
                    console.log(res.statusCode);
                }
                else{
                    res.status(200);
                    console.log('insert username');
                    //res.send();
                    //res.send([{"info:" : "Database - username inserted successfully."}]);
                }
            });
        }
    };

    static getAll(req : express.Request, res: express.Response, next: express.NextFunction){
        db.username.find((err :any, users : any) =>{
            if (err){
                res.send(err);
            }else{
                //res.json(users);
                console.log("recup all   " + users);
            }
        });
    }
    /*
    find all
     
    
     GET: api/task/:id  - for a single task
    router.get('/task/:id', function(req, res, next){
        db.tasksCollection.findOne({_id: mongojs.ObjectId(req.params.id)}, (err :any, task : any) =>{
            if (err){
                res.send(err);
            }else{
                res.json(task);
            }
        });
    });

    // POST: api/task/:id  - create a task
    router.post('/task', function(req, res, next){
        var task = req.body;

        // Send an error task is empty
        if(!task.title || (task.isDone + ''))
        {
            res.status(400);
            res.json({
                "error": "Bad data"
            })
        }else{
            // Save the task if everything is find
            db.tasks.save(task, (err :any, tasks : any) =>{
                if (err){
                    res.send(err);
                }else{
                    res.json(task);
                }
            });
        }
    });

    // DELETE: api/task/:id  - for a single task
    router.delete('/task/:id', function(req, res, next){
        db.tasksCollection.remove({_id: mongojs.ObjectId(req.params.id)}, (err :any, task : any) =>{
            if (err){
                res.send(err);
            }else{
                res.json(task);
            }
        });
    });

    // PUT: api/task  - for a single task
    router.put('/task/:id', function(req, res, next){
        var task = req.body;
        var updatedTask = {} // leave empty for now
        
        if(task.isDone){
            updatedTask = task.isDone;
        }
        if(task.title){
            updatedTask.title = task.title;
        }

        if(!updatedTask){
            res.status(400);
            res.json({
                "error":"Bad data"
            })
        }else{
            db.tasksCollection.update({_id: mongojs.ObjectId(req.params.id)}, 
                updatedTask, {/* empty object/function } , (err :any, tasks : any) =>{
                if (err){
                    res.send(err);
                }else{
                    res.json(task);
                }
            });
        }

    
    });
    */
}