import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { mongoConnect } from './services/db.js';
import usersRouter from './routes/users.routes.js';
import ruinsRouter from './routes/ruins.routes.js';
import commentsRouter from './routes/comments.routes.js';

dotenv.config();
mongoConnect();

export const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', function(req, res){
    res.send(process.env.userName);
})

app.use('/users', usersRouter);
app.use('/ruins', ruinsRouter);
app.use('/comment', commentsRouter);

export const server = app.listen(port, () => {
    console.log(`Server listening in http://localhost:${port}`);
});
