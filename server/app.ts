import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { apiRouter } from './routes';

dotenv.config();

const app: express.Application = express();

app.use(logger('dev'));
app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', express.static(path.resolve(__dirname, '../../build-client')));

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../build-client/index.html'));
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Application started on ${port}`);
});
