import express from 'express';
import {
  createActivity,
  deleteActivityById,
  editActivityById,
  getActivitiesByUser,
  getActivityById,
  getAllActivities,
  patchActivityById,
} from './controller';
import { newError, sendError } from '../utils/error';
import { ERROR_UNAUTHENTICATED } from '../../constants/messages';
import { authenticate } from '../users/authenticate';
import { checkHeaders, getArrayDataWithSelf, getDataWithSelf, parseBase10Int } from '../utils/utils';
import { HttpStatus } from '../utils/http';

export const activityRouter = express.Router();

activityRouter.post('/', checkHeaders, authenticate, async (req, res, next) => {
  try {
    if (!res.locals.authenticated) {
      throw newError(HttpStatus.Unauthorized, ERROR_UNAUTHENTICATED);
    }
    const data = await createActivity(res.locals.user.id, req.body);
    res.status(HttpStatus.Created).send(getDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

activityRouter.get('/', checkHeaders, authenticate, async (req, res, next) => {
  try {
    let data;
    if (!res.locals.authenticated) {
      data = await getAllActivities();
    } else {
      data = await getActivitiesByUser(res.locals.user.id, true);
    }
    res.status(HttpStatus.Success).send(getArrayDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

activityRouter.get('/:id', checkHeaders, authenticate, async (req, res, next) => {
  try {
    const data = await getActivityById(res.locals.user.id, parseBase10Int(req.params.id));
    res.status(HttpStatus.Success).send(getDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

activityRouter.put('/:id', checkHeaders, authenticate, async (req, res, next) => {
  try {
    if (!res.locals.authenticated) {
      throw newError(HttpStatus.Unauthorized, ERROR_UNAUTHENTICATED);
    }

    const data = await editActivityById(res.locals.user.id, parseBase10Int(req.params.id), req.body);

    res.status(HttpStatus.Success).send(getDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

activityRouter.patch('/:id', checkHeaders, authenticate, async (req, res, next) => {
  try {
    if (!res.locals.authenticated) {
      throw newError(HttpStatus.Unauthorized, ERROR_UNAUTHENTICATED);
    }

    const data = await patchActivityById(res.locals.user.id, parseBase10Int(req.params.id), req.body);

    res.status(HttpStatus.Success).send(getDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

activityRouter.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (!res.locals.authenticated) {
      throw newError(401, ERROR_UNAUTHENTICATED);
    }
    await deleteActivityById(res.locals.user.id, parseBase10Int(req.params.id));
    res.status(HttpStatus.NoContent).send(null);
  } catch (error) {
    sendError(res, error);
  }
});
