import express from 'express';
import * as yup from 'yup';
import { createUser, getUsers } from './controller';
import { checkHeaders, getArrayDataWithSelf, getDataWithSelf, validate } from '../utils/utils';
import { newError, sendError } from '../utils/error';
import { HttpStatus } from '../utils/http';
import { ERROR_NOT_ALLOWED } from '../../constants/messages';
import { login, signup } from './authenticate';
import { IUser } from './model';

export const userRouter = express.Router();

userRouter.post(
  '/signup',
  checkHeaders,
  validate(
    yup.object({
      name: yup.string().required(),
      email: yup.string().required(),
      password: yup.string().required(),
    }),
  ),
  signup,
  async (req, res, next) => {
    try {
      const data = await createUser({ ...req.body, ...res.locals.passportUser });
      res.status(HttpStatus.Created).send(getDataWithSelf(req, data));
    } catch (error) {
      sendError(res, error);
    }
  },
);

userRouter.post(
  '/login',
  checkHeaders,
  validate(
    yup.object({
      email: yup.string().required(),
      password: yup.string().required(),
    }),
  ),
  login,
  async (req, res, next) => {
    try {
      res.status(HttpStatus.Success).send(getDataWithSelf(req, res.locals.user));
    } catch (error) {
      sendError(res, error);
    }
  },
);

userRouter.get('/', async (req, res, next) => {
  try {
    const data = await getUsers();
    res.status(HttpStatus.Success).send(getArrayDataWithSelf<IUser>(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

userRouter.put('/', async (req, res, next) => {
  const error = newError(HttpStatus.MethodNotAllowed, ERROR_NOT_ALLOWED);
  sendError(res, error);
});

userRouter.delete('/', async (req, res, next) => {
  const error = newError(HttpStatus.MethodNotAllowed, ERROR_NOT_ALLOWED);
  sendError(res, error);
});
