import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { Passport } from '../clients/passport';
import { sendError } from '../utils/error';

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(Passport.Login, (err, user) => {
    if (err) {
      sendError(res, err);
    } else {
      res.locals.user = user;
      next();
    }
  })(req, res, next);
};

export const signup = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(Passport.Signup, async (err, passportUser) => {
    if (err) {
      sendError(res, err);
    } else {
      res.locals.passportUser = passportUser;
      next();
    }
  })(req, res, next);
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(Passport.JWT, async (err, user) => {
    if (err) {
      sendError(res, err);
    } else if (user) {
      res.locals.authenticated = true;
      res.locals.user = user;
      next();
    } else {
      res.locals.authenticated = false;
      res.locals.user = {};
      next();
    }
  })(req, res, next);
};
