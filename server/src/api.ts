import * as express from 'express';

import { UserSchema, IUserModel } from './models/user';
import { TaskListSchema, ITaskListModel } from './models/taskList';

const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.send('API is up!');
});

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
}); */

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
            return res.status(403).send({ message: 'You don\'t have permissions to delete this list.'});
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

// Login
router.post('/login', (req: express.Request, res: express.Response) => {
    console.log(`Body received: ${JSON.stringify(req.body)}`);
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
