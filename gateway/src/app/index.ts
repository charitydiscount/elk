import * as express from 'express';
import helmet = require('helmet');
import bearerToken = require('express-bearer-token');
import { corsMw, firebaseAuth } from '../middlwares';
import router from './routes';

const app = express();

app.use(corsMw);
app.options('*', corsMw);

app.use(helmet());
app.use(bearerToken());

app.use(firebaseAuth);

app.use('/search', router);

export default app;
