import passport from 'passport';
import _ from 'lodash';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import jsonwebtoken, { Secret } from 'jsonwebtoken';
import { UserModel } from '../user/model';
import { newError } from '../utils/error';
import { ERROR_INVALID_CREDENTIALS, ERROR_NON_UNIQUE_NAME } from '../../constants/messages';
import { hashCompare, hashCrypto } from './crypto';
import { HttpStatus } from '../utils/http';

export enum Passport {
  Signup = 'SIGNUP',
  Login = 'LOGIN',
  JWT = 'JWT',
}

passport.use(
  Passport.Signup,
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.getByEmail(email);
        if (user) {
          throw newError(HttpStatus.Forbidden, ERROR_NON_UNIQUE_NAME);
        }

        const hashedPassword = await hashCrypto(password);

        return done(null, {
          email,
          password: hashedPassword,
          token: jsonwebtoken.sign(email, process.env.JWT_SECRET as Secret),
        });
      } catch (e) {
        return done(e);
      }
    },
  ),
);

passport.use(
  Passport.Login,
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.getForAuthentication(email);

        if (_.isEmpty(user)) {
          throw newError(HttpStatus.Unauthorized, ERROR_INVALID_CREDENTIALS);
        }

        const authenticated = await hashCompare(password, user.password!);

        if (!authenticated) {
          throw newError(HttpStatus.Unauthorized, ERROR_INVALID_CREDENTIALS);
        }

        // we delete the user password here so it doesn't get returned to the rest of the app
        delete user.password;

        // set token
        user.token = jsonwebtoken.sign(email, process.env.JWT_SECRET as Secret);

        return done(null, user);
      } catch (e) {
        return done(e);
      }
    },
  ),
);

passport.use(
  Passport.JWT,
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (JWTPayload, done) => {
      // passport-jwt expects simple done() call without return
      try {
        const user = await UserModel.getByEmail(JWTPayload.id);
        if (_.isEmpty(user)) {
          done(null, false);
        } else {
          done(null, user);
        }
      } catch (err) {
        done(err);
      }
    },
  ),
);
