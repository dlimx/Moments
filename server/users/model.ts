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
  self?: string;
}

class UserModelFactory implements Partial<IModel<IUser>> {
  getAll = async () => {
    const query = datastore.createQuery(KEY_USER);

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<IUser>(data).map((user) => {
      // eslint-disable-next-line no-param-reassign
      delete user.password;
      return user;
    });
  };

  create = async (payload: Partial<IUser>) => {
    const key = datastore.key(KEY_USER);

    const saveData = { ...payload };
    delete saveData.token;

    const data = await datastore.save({ key, data: saveData });
    const user = { ...payload, id: parseIDFromDatastoreResult(data) } as IUser;
    delete user.password;

    return user;
  };

  getByEmail = async (email: string) => {
    const user = await this.getForAuthentication(email);
    if (user) {
      delete user.password;
    }

    return user;
  };

  getForAuthentication = async (email: string) => {
    const query = datastore.createQuery(KEY_USER);
    query.filter('email', email);

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<IUser>(data)[0];
  };
}

export const UserModel = new UserModelFactory();
