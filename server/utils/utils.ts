import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { ObjectSchema, Schema } from 'yup';
import { newError, sendError } from './error';
import { ERROR_ACCEPT_TYPE } from '../../constants/messages';
import { IObject } from '../types/generics';
import { HttpStatus } from './http';

export const getDataWithSelf = <T extends IObject>(req: Request, data: T) => ({
  ...data,
  self: `${req.protocol}://${req.get('host')}${req.baseUrl}/${data.id}`,
});

export const getArrayDataWithSelf = <T extends IObject>(req: Request, data: T[]) =>
  data.map((datum) => getDataWithSelf(req, datum));

export const checkClientAcceptType = (req: Request, res: Response, next: NextFunction) => {
  const Accept = req.get('Accept');

  if (!Accept || !Accept.includes('application/json')) {
    // && !Accept.includes('*/*') && !Accept.includes('text/plain'))
    const error = newError(HttpStatus.NotAcceptable, ERROR_ACCEPT_TYPE);
    sendError(res, error);
    res.end();
  }

  next();
};

export const validate = (schema: Schema<any>, body: string = 'body') => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await schema.validate(_.get(req, body));
    next();
  } catch (e) {
    const error = newError(HttpStatus.BadRequest, e.errors[0]);
    sendError(res, error);
  }
};
