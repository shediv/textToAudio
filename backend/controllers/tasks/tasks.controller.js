//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
const task = require('../../models/Task');
const fs = require("fs");

// GET HTTP sorted and paginated data
router.get('/', (req, res) => {
    task.getAllTasks(req.query, (err, tasks, totalTasks) => {
        if (err) {
            res.status(501).json({
                success: false,
                message: `Failed to load all tasks. Error: ${err}`
            });
        } else {
            res.status(200).write(JSON.stringify({
                success: true,
                tasks: tasks,
                totalTasks: totalTasks
            }, null, 2));
            res.end();

        }
    });
});

// GET HTTP id data
router.get('/:id', (req, res) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    task.getTaskById(id, (err, tasks) => {
        if (err) {
            res.status(501).json({
                success: false,
                message: `Failed to load single task. Error: ${err}`
            });
        } else {
            res.status(200).write(JSON.stringify({
                success: true,
                tasks: tasks
            }, null, 2));
            res.end();

        }
    });
});

//POST HTTP method to add task
router.post('/', (req, res, next) => {
    let newTask = new task({
        email: req.body.email,
        description: req.body.description
    });
    task.addTask(newTask, (err, list) => {
        if (err) {
            res.status(501).json({
                success: false,
                message: `Failed to create a new task. Error: ${err}`
            });

        } else {
            const textPath = "textFiles/"+req.body.email+"temp.txt";
            fs.writeFile(textPath, req.body.description, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
                res.status(200).json({
                    success: true,
                    message: "Added successfully."
                });
            });
            // res.status(200).json({
            //     success: true,
            //     message: "Added successfully."
            // });
        }    
    });
});

//DELETE HTTP method to delete task. Here, we pass in a param which is the object id.
router.delete('/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    //Call the model method deleteListById
    task.deleteTaskById(id, (err, list) => {
        if (err) {
            res.status(501).json({
                success: false,
                message: `Failed to delete the task. Error: ${err}`
            });
        } else if (list) {
            res.status(200).json({
                success: true,
                message: "Deleted successfully"
            });
        } else {
            res.status(501).json({
                success: false,
                message: `Failed to delete the task. Unknown Error.`
            });
        }
    });
});

//PUT HTTP method to update task. Here, we pass in id and updated task in body.
router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    task.updateById(id, req.body.task, (err, updatedTask) => {
        if (err) {
            res.status(501).json({
                success: false,
                message: `Failed to update the task. Error: ${err}`
            });
        } else if (updatedTask) {
            res.status(200).json({
                success: true,
                message: "Updated successfully"
            });
        } else {
            res.status(501).json({
                success: false,
                message: `Failed to update the task. Unknown Error.`
            });
        }
    })
});

module.exports = router;