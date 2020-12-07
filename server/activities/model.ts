import { Datastore } from '@google-cloud/datastore';
import { IModel, IPaginatedData } from '../types/generics';
import { datastore } from '../client/datastore';
import { DEFAULT_PAGE_SIZE, KEY_ACTIVITY } from '../../constants/constants';
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
  categoryIDs: number[];
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

  getAll = async (cursor?: string) => {
    const query = datastore.createQuery(KEY_ACTIVITY).limit(DEFAULT_PAGE_SIZE);
    query.filter('public', true);

    if (cursor) {
      query.start(cursor);
    }

    const data = await datastore.runQuery(query);
    return {
      data: parseDataFromDatastoreResult<IActivity>(data),
      nextCursor: data[1].endCursor,
      more: data[1].moreResults !== Datastore.NO_MORE_RESULTS,
    };
  };

  getByID = async (id: number) => {
    const key = datastore.key([KEY_ACTIVITY, id]);

    const data = await datastore.get(key);

    if (!data[0]) {
      throw newError(HttpStatus.NotFound, ERROR_NOT_FOUND);
    }

    return { ...data[0], id };
  };

  getAllByID = async (ids: number[]) => {
    const keys = ids.map((id) => datastore.key([KEY_ACTIVITY, id]));

    const data = await datastore.get(keys);

    return ids.map((id, i) => ({ ...data[0][i], id }));
  };

  getByUserID = async (userID: number, authenticated: boolean, cursor?: string): Promise<IPaginatedData<IActivity>> => {
    const query = datastore.createQuery(KEY_ACTIVITY).limit(DEFAULT_PAGE_SIZE);
    query.filter('userID', userID);

    if (!authenticated) {
      query.filter('public', true);
    }

    if (cursor) {
      query.start(cursor);
    }

    const data = await datastore.runQuery(query);
    return {
      data: parseDataFromDatastoreResult<IActivity>(data),
      nextCursor: data[1].endCursor,
      more: data[1].moreResults !== Datastore.NO_MORE_RESULTS,
    };
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

  editAllByID = async (ids: number[], payloads: IActivity[]) => {
    const data = ids.map((id, i) => ({ key: datastore.key([KEY_ACTIVITY, id]), data: payloads[i] }));

    await datastore.save(data);

    return payloads;
  };

  deleteByID = async (id: number): Promise<void> => {
    const key = datastore.key([KEY_ACTIVITY, id]);

    await datastore.delete(key);
  };
}

export const ActivityModel = new ActivityModelFactory();
