import * as express from 'express';

import { UserSchema, IUserModel } from './models/user';
import { TaskListSchema, ITaskListModel } from './models/taskList';

const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.send('API is up!');
});


/**
 * TEST ROUTES!!!
 */
/* router.get('/test/addUsers', (req, res) => {
    UserSchema.insertMany([
        { username: 'jereaa' },
        { username: 'miauricio' }
    ],
    (error: Error, docs: IUserModel[]) => {
        if (error) {
            return res.status(500).send({ message: error.message });
        }
        res.send(docs);
    });
});

router.get('/test/addTasks', (req, res) => {
    TaskListSchema.insertMany([
        {
            title: 'List title 1',
            description: 'This is the description for this list',
            userIds: ['5bcf418e51185144e0487c0c'],
            tasks: [
                {
                    title: 'Task number 1',
                    description: 'Task 1 description!',
                    status: 1,
                    order: 555
                },
                {
                    title: 'Task 2',
                    description: 'Less motivated description'
                }
            ]
        },
        {
            title: 'Another list',
            description: 'List with no tasks',
            userIds: ['5bcf418e51185144e0487c0c']
        }
    ],
    (error: Error, docs: ITaskListModel[]) => {
        if (error) {
            return res.status(500).send({ message: error.message });
        }
        return res.send(docs);
    });
});
 */

// Get all lists from certain user
router.get('/lists/:userId', (req: express.Request, res: express.Response) => {
    TaskListSchema.find({ userIds: { $elemMatch: { $eq: req.params.userId } } }, (err: Error, lists: ITaskListModel[]) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        return res.send(lists);
    });
});

// New TaskList for certain user
router.post('/lists/:userId', (req: express.Request, res: express.Response) => {
    const newList = new TaskListSchema({
        title: req.body.title,
        description: req.body.description,
        tasks: null,
        userIds: [req.params.userId]
    });
    newList.save((err: Error) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        return res.send(newList);
    });
});

// Get a certain list
router.get('/lists/:userId/:id', (req: express.Request, res: express.Response) => {
    TaskListSchema.findById(req.params.id, (err: Error, taskList: ITaskListModel) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (!taskList) {
            return res.status(400).send({ message: 'List not found.' });
        }
        if (taskList.userIds.indexOf(req.params.userId) === -1) {
            return res.status(403).send({ message: 'You don\'t have permissions to access this list.'});
        }

        return res.send(taskList);
    });
});

// Edit a certain list
router.put('/lists/:userId/:id', (req: express.Request, res: express.Response) => {
    TaskListSchema.findById(req.params.id, (err: Error, taskList: ITaskListModel) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (!taskList) {
            return res.status(400).send({ message: 'List not found.' });
        }
        if (taskList.userIds.indexOf(req.params.userId) === -1) {
            return res.status(403).send({ message: 'You don\'t have permissions to edit this list.'});
        }

        taskList.title = req.body.title;
        taskList.description = req.body.description;
        taskList.userIds = req.body.userIds;

        taskList.save((editError: Error) => {
            if (editError) {
                return res.status(500).send({ message: editError.message });
            }
            return res.send(taskList);
        });
    });
});

// Delete a TaskList
router.delete('/lists/:userId/:id', (req: express.Request, res: express.Response) => {
    TaskListSchema.findById(req.params.id, (err: Error, taskList: ITaskListModel) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (!taskList) {
            return res.status(400).send({ message: 'List not found.' });
        }
        if (taskList.userIds.indexOf(req.params.userId) === -1) {
            return res.status(403).send({ message: 'You don\'t have permissions to delete this list.'});
        }
        taskList.remove((delError: Error) => {
            if (delError) {
                return res.status(500).send({ message: delError.message });
            }
            return res.send({ message: 'List deleted successfully. '});
        });
    });
});

// Add new Task to a certain TaskList
router.post('/lists/:userId/:listId/newTask', (req: express.Request, res: express.Response) => {
    TaskListSchema.findById(req.params.listId, (err: Error, taskList: ITaskListModel) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (!taskList) {
            return res.status(400).send({ message: 'List not found.' });
        }
        if (taskList.userIds.indexOf(req.params.userId) === -1) {
            return res.status(403).send({ message: 'You don\'t have permissions to add to this list.'});
        }
        if (!taskList.tasks) {
            taskList.tasks = [];
        }
        taskList.tasks.push(req.body);
        taskList.save((saveError: Error, savedTaskList) => {
            if (saveError) {
                return res.status(500).send({ message: saveError.message });
            }
            return res.send(savedTaskList.tasks[savedTaskList.tasks.length - 1]);
        });
    });
});

// Edit a certain Task in a certain List (these routes are getting quite messy...)
router.put('/lists/:userId/:listId/:taskId', (req: express.Request, res: express.Response) => {
    TaskListSchema.findById(req.params.listId, (err: Error, taskList: ITaskListModel) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (!taskList) {
            return res.status(400).send({ message: 'List not found.' });
        }
        if (taskList.userIds.indexOf(req.params.userId) === -1) {
            return res.status(403).send({ message: 'You don\'t have permissions to edit this task.'});
        }

        const index = taskList.tasks.findIndex(elem => elem._id.equals(req.params.taskId));
        if (index === -1) {
            return res.status(400).send({ message: 'Task not found.' });
        }

        req.body._id = taskList.tasks[index]._id;   // Just making sure the ID doesn't change
        taskList.tasks.splice(index, 1, req.body);

        taskList.save((saveError: Error, savedTaskList) => {
            if (saveError) {
                return res.status(500).send({ message: saveError.message });
            }
            return res.send(savedTaskList.tasks[index]);
        });
    });
});

// Delete a certain Task in a certain List (these routes are getting quite messy...)
router.delete('/lists/:userId/:listId/:taskId', (req: express.Request, res: express.Response) => {
    TaskListSchema.findById(req.params.listId, (err: Error, taskList: ITaskListModel) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (!taskList) {
            return res.status(400).send({ message: 'List not found.' });
        }
        if (taskList.userIds.indexOf(req.params.userId) === -1) {
            return res.status(403).send({ message: 'You don\'t have permissions to edit this task.'});
        }

        const index = taskList.tasks.findIndex(elem => elem._id.equals(req.params.taskId));
        if (index === -1) {
            return res.status(400).send({ message: 'Task not found.' });
        }

        taskList.tasks.splice(index, 1);
        taskList.save((saveError: Error, savedTaskList) => {
            if (saveError) {
                return res.status(500).send({ message: saveError.message });
            }
            return res.send({ message: 'Task deleted successfully.' });
        });
    });
});

// Login
router.post('/login', (req: express.Request, res: express.Response) => {
    UserSchema.findOne({ username: req.body.username }, (err: Error, existingUser: IUserModel) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (existingUser) {
            return res.send(existingUser);
        }
        return res.status(400).send('User not found');
    });
});

export { router };
