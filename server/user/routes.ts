import express from 'express';
import { createUser, getUsers } from './controller';
import { checkClientAcceptType, getArrayDataWithSelf, getDataWithSelf } from '../utils/utils';
import { newError, sendError } from '../utils/error';
import { StatusCode } from '../utils/http';
import { ERROR_NOT_ALLOWED } from '../../constants/messages';

export const userRouter = express.Router();

userRouter.post('/', checkClientAcceptType, async (req, res, next) => {
  try {
    const data = await createUser(req.body);
    res.status(StatusCode.Created).send(getDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

userRouter.get('/', async (req, res, next) => {
  try {
    const data = await getUsers();
    res.status(StatusCode.Success).send(getArrayDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

userRouter.put('/', async (req, res, next) => {
  const error = newError(StatusCode.MethodNotAllowed, ERROR_NOT_ALLOWED);
  sendError(res, error);
});

userRouter.delete('/', async (req, res, next) => {
  const error = newError(StatusCode.MethodNotAllowed, ERROR_NOT_ALLOWED);
  sendError(res, error);
});
