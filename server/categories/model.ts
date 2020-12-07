import { Datastore } from '@google-cloud/datastore';
import { IModel } from '../types/generics';
import { datastore } from '../client/datastore';
import { DEFAULT_PAGE_SIZE, KEY_CATEGORY } from '../../constants/constants';
import { parseDataFromDatastoreResult, parseIDFromDatastoreResult } from '../client/datastoreUtils';
import { newError } from '../utils/error';
import { HttpStatus } from '../utils/http';
import { ERROR_NOT_FOUND } from '../../constants/messages';

export interface ICategoryData {
  name: string;
  description?: string;
  keywords?: string[];
  activityIDs: number[];
}

export interface ICategory extends ICategoryData {
  id: number;
  self?: string;
}

class CategoryModelFactory implements IModel<ICategory> {
  create = async (payload: Partial<ICategory>) => {
    const key = datastore.key(KEY_CATEGORY);

    const data = await datastore.save({ key, data: payload });
    return { ...payload, id: parseIDFromDatastoreResult(data) } as ICategory;
  };

  getAll = async (cursor?: string) => {
    const query = datastore.createQuery(KEY_CATEGORY).limit(DEFAULT_PAGE_SIZE);

    if (cursor) {
      query.start(cursor);
    }

    const data = await datastore.runQuery(query);
    return {
      data: parseDataFromDatastoreResult<ICategory>(data),
      nextCursor: data[1].endCursor,
      more: data[1].moreResults !== Datastore.NO_MORE_RESULTS,
    };
  };

  getByID = async (id: number) => {
    const key = datastore.key([KEY_CATEGORY, id]);

    const data = await datastore.get(key);

    if (!data[0]) {
      throw newError(HttpStatus.NotFound, ERROR_NOT_FOUND);
    }

    return { ...data[0], id };
  };

  getAllByID = async (ids: number[]) => {
    const keys = ids.map((id) => datastore.key([KEY_CATEGORY, id]));

    const data = await datastore.get(keys);

    return ids.map((id, i) => ({ ...data[0][i], id }));
  };

  getByName = async (name: string) => {
    const query = datastore.createQuery(KEY_CATEGORY);
    query.filter('name', name);

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<ICategory>(data)[0];
  };

  editByID = async (id: number, payload: Partial<ICategory>) => {
    const key = datastore.key([KEY_CATEGORY, id]);

    await datastore.save({ key, data: payload });
    return { ...payload, id } as ICategory;
  };

  editAllByID = async (ids: number[], payloads: ICategory[]) => {
    const data = ids.map((id, i) => ({ key: datastore.key([KEY_CATEGORY, id]), data: payloads[i] }));

    await datastore.save(data);

    return payloads;
  };

  deleteByID = async (id: number): Promise<void> => {
    const key = datastore.key([KEY_CATEGORY, id]);

    await datastore.delete(key);
  };
}

export const CategoryModel = new CategoryModelFactory();
