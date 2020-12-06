import { IModel } from '../types/generics';
import { datastore } from '../client/datastore';
import { KEY_USER } from '../../constants/constants';
import { parseDataFromDatastoreResult, parseIDFromDatastoreResult } from '../client/datastoreUtils';

export interface IUserData {
  name: string;
  password?: string;
}

export interface IUser extends IUserData {
  id: number;
}

export class UserModel implements Partial<IModel<IUser>> {
  static getAll = async () => {
    const query = datastore.createQuery(KEY_USER);

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<IUser[]>(data);
  };

  static create = async (payload: Partial<IUser>) => {
    const key = datastore.key(KEY_USER);

    const data = await datastore.save({ key, data: payload });
    return { ...payload, id: parseIDFromDatastoreResult(data) } as IUser;
  };
}
