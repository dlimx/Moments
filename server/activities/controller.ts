/* eslint-disable no-param-reassign */
import _ from 'lodash';
import { ActivityModel, IActivity, IActivityData } from './model';
import { newError } from '../utils/error';
import { HttpStatus } from '../utils/http';
import {
  ERROR_INVALID_ATTRIBUTE,
  ERROR_NON_UNIQUE_NAME,
  ERROR_NOT_FOUND,
  ERROR_UNAUTHORIZED,
} from '../../constants/messages';
import { getCategoryById } from '../categories/controller';
import { CategoryModel } from '../categories/model';
import { IPaginatedData } from '../types/generics';

export const createActivity = async (userID: number, payload: IActivityData): Promise<IActivity> => {
  const duplicateNames = await ActivityModel.getByName(payload.name);

  if (duplicateNames) {
    throw newError(HttpStatus.Forbidden, ERROR_NON_UNIQUE_NAME);
  }

  payload.userID = userID;
  payload.categoryIDs = [];

  return ActivityModel.create(payload);
};

export const getAllActivities = async (cursor?: string): Promise<IPaginatedData<IActivity>> =>
  ActivityModel.getAll(cursor);

export const getActivitiesByUser = async (
  userID: number,
  authenticated = false,
  cursor?: string,
): Promise<IPaginatedData<IActivity>> => ActivityModel.getByUserID(userID, authenticated, cursor);

export const getActivityById = async (userID: number, id: number): Promise<IActivity> => {
  const data = await ActivityModel.getByID(id);

  if (data.userID !== userID && !data.public) {
    throw newError(HttpStatus.Forbidden, ERROR_UNAUTHORIZED);
  }

  return data;
};

export const editActivityById = async (
  userID: number,
  id: number,
  payload: Partial<IActivity>,
  patch = false,
): Promise<IActivity> => {
  const activity = await getActivityById(userID, id);

  if (patch) {
    payload = {
      ...activity,
      ...payload,
    };
  }

  const duplicateNames = await ActivityModel.getByName(payload.name as string);

  if (duplicateNames && duplicateNames.id !== id) {
    throw newError(HttpStatus.Forbidden, ERROR_NON_UNIQUE_NAME);
  }

  if (activity.userID !== userID) {
    throw newError(HttpStatus.Forbidden, ERROR_UNAUTHORIZED);
  }
  if (payload.id) {
    delete payload.id;
  }

  payload.userID = userID;
  payload.categoryIDs = activity.categoryIDs;

  return ActivityModel.editByID(id, payload);
};

export const patchActivityById = async (userID: number, id: number, payload: Partial<IActivity>) =>
  editActivityById(userID, id, payload, true);

export const deleteActivityById = async (userID: number, id: number) => {
  const activity = await getActivityById(userID, id);

  if (activity.userID !== userID) {
    throw newError(HttpStatus.Forbidden, ERROR_UNAUTHORIZED);
  }

  if (activity.categoryIDs.length) {
    const categories = await CategoryModel.getAllByID(activity.categoryIDs);
    await CategoryModel.editAllByID(
      activity.categoryIDs,
      categories.map((category) => ({
        ...category,
        activityIDs: category.activityIDs.filter((aID: number) => aID !== id),
      })),
    );
  }

  return ActivityModel.deleteByID(id);
};

export const addActivityCategory = async (userID: number, id: number, categoryID: number) => {
  const activity = await getActivityById(userID, id);
  const category = await getCategoryById(categoryID);

  if (activity.userID !== userID) {
    throw newError(HttpStatus.Forbidden, ERROR_UNAUTHORIZED);
  }

  if (_.includes(activity.categoryIDs, categoryID)) {
    throw newError(HttpStatus.BadRequest, ERROR_INVALID_ATTRIBUTE);
  }

  activity.categoryIDs.push(categoryID);
  category.activityIDs.push(id);

  return Promise.all([ActivityModel.editByID(id, activity), CategoryModel.editByID(categoryID, category)]);
};

export const removeActivityCategory = async (userID: number, id: number, categoryID: number) => {
  const activity = await getActivityById(userID, id);
  const category = await getCategoryById(categoryID);

  if (activity.userID !== userID) {
    throw newError(HttpStatus.Forbidden, ERROR_UNAUTHORIZED);
  }

  if (!_.includes(activity.categoryIDs, categoryID)) {
    throw newError(HttpStatus.NotFound, ERROR_NOT_FOUND);
  }

  activity.categoryIDs = activity.categoryIDs?.filter((cID) => cID !== categoryID);
  category.activityIDs = category.activityIDs?.filter((aID) => aID !== id);

  return Promise.all([ActivityModel.editByID(id, activity), CategoryModel.editByID(categoryID, category)]);
};
