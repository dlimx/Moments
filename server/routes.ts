import express from 'express';
import { userRouter } from './users/routes';
import { activityRouter } from './activities/routes';
import { categoryRouter } from './categories/routes';

export const apiRouter = express.Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/activities', activityRouter);
apiRouter.use('/categories', categoryRouter);
