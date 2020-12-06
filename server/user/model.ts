import { IModel } from '../types/generics';
import { datastore } from '../client/datastore';
import { KEY_USER } from '../../constants/constants';
import { parseDataFromDatastoreResult, parseIDFromDatastoreResult } from '../client/datastoreUtils';

export interface IUserData {
  name: string;
  email: string;
  password?: string;
}

export interface IUser extends IUserData {
  id: number;
  token?: string;
}

export class UserModel implements Partial<IModel<IUser>> {
  static getAll = async () => {
    const query = datastore.createQuery(KEY_USER);

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<IUser[]>(data);
  };

  static create = async (payload: Partial<IUser>) => {
    const key = datastore.key(KEY_USER);

    const saveData = { ...payload };
    delete saveData.token;

    const data = await datastore.save({ key, data: saveData });
    const user = { ...payload, id: parseIDFromDatastoreResult(data) } as IUser;
    delete user.password;

    return user;
  };

  static getByEmail = async (email: string) => {
    const user = await UserModel.getForAuthentication(email);
    if (user) {
      delete user.password;
    }

    return user;
  };

  static getForAuthentication = async (email: string) => {
    const query = datastore.createQuery(KEY_USER);
    query.filter('email', email);

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<IUser[]>(data)[0];
  };
}
