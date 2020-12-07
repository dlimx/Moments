import { IModel } from '../types/generics';
import { datastore } from '../client/datastore';
import { KEY_ACTIVITY } from '../../constants/constants';
import { parseDataFromDatastoreResult, parseIDFromDatastoreResult } from '../client/datastoreUtils';
import { newError } from '../utils/error';
import { HttpStatus } from '../utils/http';
import { ERROR_NOT_FOUND } from '../../constants/messages';

export interface IActivityData {
  name: string;
  description?: string;
  time: number;
  userID: number;
  public: boolean;
  categoryIDs?: number[];
}

export interface IActivity extends IActivityData {
  id: number;
  self?: string;
}

class ActivityModelFactory implements IModel<IActivity> {
  create = async (payload: Partial<IActivity>) => {
    const key = datastore.key(KEY_ACTIVITY);

    const data = await datastore.save({ key, data: payload });
    return { ...payload, id: parseIDFromDatastoreResult(data) } as IActivity;
  };

  getAll = async () => {
    const query = datastore.createQuery(KEY_ACTIVITY);
    query.filter('public', true);

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<IActivity>(data);
  };

  getByID = async (id: number) => {
    const key = datastore.key([KEY_ACTIVITY, id]);

    const data = await datastore.get(key);

    if (!data[0]) {
      throw newError(HttpStatus.NotFound, ERROR_NOT_FOUND);
    }

    return { ...data[0], id };
  };

  getByUserID = async (userID: number, authenticated: boolean) => {
    const query = datastore.createQuery(KEY_ACTIVITY);
    query.filter('userID', userID);

    if (!authenticated) {
      query.filter('public', true);
    }

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<IActivity>(data);
  };

  getByName = async (name: string) => {
    const query = datastore.createQuery(KEY_ACTIVITY);
    query.filter('name', name);

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<IActivity>(data)[0];
  };

  editByID = async (id: number, payload: Partial<IActivity>) => {
    const key = datastore.key([KEY_ACTIVITY, id]);

    await datastore.save({ key, data: payload });
    return { ...payload, id } as IActivity;
  };

  deleteByID = async (id: number): Promise<void> => {
    const key = datastore.key([KEY_ACTIVITY, id]);

    await datastore.delete(key);
  };
}

export const ActivityModel = new ActivityModelFactory();
