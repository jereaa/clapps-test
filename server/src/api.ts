import * as express from 'express';

import { UserSchema, IUserModel } from './models/user';

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
