import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { ObjectSchema, Schema } from 'yup';
import { newError, sendError } from './error';
import { ERROR_ACCEPT_TYPE } from '../../constants/messages';
import { IObject } from '../../types/generics';
import { HttpStatus } from './http';

export const getDataWithSelf = <T extends IObject>(req: Request, data: T) => {
  const result = {
    ...data,
    self: `${req.protocol}://${req.get('host')}${req.baseUrl}/${data.id}`,
  } as any;

  // TODO - strip hacky way of adding self - for assignment only

  console.log(result);
  if (result.activityIDs) {
    result.activityIDs = result.activityIDs.map((id: number) => ({
      id,
      self: `${req.protocol}://${req.get('host')}${req.baseUrl}/${data.id}`.replace('categories', 'activities'),
    }));
  }

  if (result.categoryIDs) {
    result.categoryIDs = result.categoryIDs.map((id: number) => ({
      id,
      self: `${req.protocol}://${req.get('host')}${req.baseUrl}/${data.id}`.replace('activities', 'categories'),
    }));
  }

  return result as T;
};

export const getArrayDataWithSelf = <T extends IObject>(req: Request, data: T[]) =>
  data.map((datum) => getDataWithSelf(req, datum));

export const checkHeaders = (req: Request, res: Response, next: NextFunction) => {
  const Accept = req.get('Accept');

  if (!Accept || !Accept.includes('application/json')) {
    // && !Accept.includes('*/*') && !Accept.includes('text/plain'))
    const error = newError(HttpStatus.NotAcceptable, ERROR_ACCEPT_TYPE);
    sendError(res, error);
  } else {
    next();
  }
};

export const validate = (schema: Schema<any>, body: string = 'body', stripUnknown = true) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = await schema.validate(_.get(req, body), { stripUnknown });
    _.get(req, body, payload);
    next();
  } catch (e) {
    const error = newError(HttpStatus.BadRequest, e.errors[0]);
    sendError(res, error);
  }
};

export const parseBase10Int = (int: string): number => Number.parseInt(int, 10);
