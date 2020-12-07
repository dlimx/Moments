/* eslint-disable no-param-reassign */
import { CategoryModel, ICategory, ICategoryData } from './model';
import { newError } from '../utils/error';
import { HttpStatus } from '../utils/http';
import { ERROR_NON_UNIQUE_NAME, ERROR_UNAUTHORIZED } from '../../constants/messages';
import { ActivityModel } from '../activities/model';

export const createCategory = async (payload: ICategoryData): Promise<ICategory> => {
  const duplicateNames = await CategoryModel.getByName(payload.name);

  if (duplicateNames) {
    throw newError(HttpStatus.Forbidden, ERROR_NON_UNIQUE_NAME);
  }

  payload.activityIDs = [];

  return CategoryModel.create(payload);
};

export const getAllCategories = async (): Promise<ICategory[]> => CategoryModel.getAll();

export const getCategoryById = async (id: number): Promise<ICategory> => {
  const data = await CategoryModel.getByID(id);

  return data;
};

export const editCategoryById = async (id: number, payload: Partial<ICategory>, patch = false): Promise<ICategory> => {
  const savedCategory = await getCategoryById(id);

  if (patch) {
    payload = {
      ...savedCategory,
      ...payload,
    };
  }

  const duplicateNames = await CategoryModel.getByName(payload.name as string);

  if (duplicateNames && duplicateNames.id !== id) {
    throw newError(HttpStatus.Forbidden, ERROR_NON_UNIQUE_NAME);
  }

  if (payload.id) {
    delete payload.id;
  }

  payload.activityIDs = savedCategory.activityIDs;

  return CategoryModel.editByID(id, payload);
};

export const patchCategoryById = async (id: number, payload: Partial<ICategory>) => editCategoryById(id, payload, true);

export const deleteCategoryById = async (id: number) => {
  const category = await getCategoryById(id);
  if (category.activityIDs.length) {
    const activities = await ActivityModel.getAllByID(category.activityIDs);
    await ActivityModel.editAllByID(
      category.activityIDs,
      activities.map((activity) => ({
        ...activity,
        categoryIDs: activity.categoryIDs.filter((cID: number) => cID !== id),
      })),
    );
  }

  return CategoryModel.deleteByID(id);
};
