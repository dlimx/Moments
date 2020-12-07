import NError, { VError } from '@netflix/nerror';
import { Response } from 'express';
import { HttpStatus } from './http';

interface VErrorJS extends VError {
  jse_info?: Record<string, any>;
}

export const newError = (code: HttpStatus, message: string): VErrorJS => new NError.VError({ info: { code } }, message);

export const sendError = (res: Response, error: VErrorJS) => {
  const status = (error.jse_info && error.jse_info.code) || HttpStatus.BadRequest;
  console.error(error);
  res.status(status).send({ Error: error.message });
};
