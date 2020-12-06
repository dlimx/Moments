import { NextFunction, Request, Response } from 'express';
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
