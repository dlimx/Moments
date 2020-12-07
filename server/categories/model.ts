import { IModel } from '../types/generics';
import { datastore } from '../client/datastore';
import { KEY_CATEGORY } from '../../constants/constants';
import { parseDataFromDatastoreResult, parseIDFromDatastoreResult } from '../client/datastoreUtils';
import { newError } from '../utils/error';
import { HttpStatus } from '../utils/http';
import { ERROR_NOT_FOUND } from '../../constants/messages';

export interface ICategoryData {
  name: string;
  description?: string;
  keywords?: string[];
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

  getAll = async () => {
    const query = datastore.createQuery(KEY_CATEGORY);

    const data = await datastore.runQuery(query);
    return parseDataFromDatastoreResult<ICategory>(data);
  };

  getByID = async (id: number) => {
    const key = datastore.key([KEY_CATEGORY, id]);

    const data = await datastore.get(key);

    if (!data[0]) {
      throw newError(HttpStatus.NotFound, ERROR_NOT_FOUND);
    }

    return { ...data[0], id };
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

  deleteByID = async (id: number): Promise<void> => {
    const key = datastore.key([KEY_CATEGORY, id]);

    await datastore.delete(key);
  };
}

export const CategoryModel = new CategoryModelFactory();
