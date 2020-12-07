/* eslint-disable no-param-reassign */
import { ActivityModel, IActivity, IActivityData } from './model';
import { newError } from '../utils/error';
import { HttpStatus } from '../utils/http';
import { ERROR_NON_UNIQUE_NAME, ERROR_UNAUTHORIZED } from '../../constants/messages';

export const createActivity = async (userID: number, payload: IActivityData): Promise<IActivity> => {
  const duplicateNames = await ActivityModel.getByName(payload.name);

  if (duplicateNames) {
    throw newError(HttpStatus.Forbidden, ERROR_NON_UNIQUE_NAME);
  }

  payload.userID = userID;

  return ActivityModel.create(payload);
};

export const getAllActivities = async (): Promise<IActivity[]> => ActivityModel.getAll();

export const getActivitiesByUser = async (userID: number, authenticated = false): Promise<IActivity[]> =>
  ActivityModel.getByUserID(userID, authenticated);

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
  const duplicateNames = await ActivityModel.getByName(payload.name as string);

  if (duplicateNames) {
    throw newError(HttpStatus.Forbidden, ERROR_NON_UNIQUE_NAME);
  }

  const savedActivity = await getActivityById(userID, id);

  if (savedActivity.userID !== userID) {
    throw newError(HttpStatus.Forbidden, ERROR_UNAUTHORIZED);
  }

  if (patch) {
    payload = {
      ...savedActivity,
      ...payload,
    };
  }

  if (payload.id) {
    delete payload.id;
  }

  payload.userID = userID;
  payload.categoryIDs = savedActivity.categoryIDs;

  return ActivityModel.editByID(id, payload);
};

export const patchActivityById = async (userID: number, id: number, payload: Partial<IActivity>) =>
  editActivityById(userID, id, payload, true);

export const deleteActivityById = async (userID: number, id: number) => {
  const savedActivity = await getActivityById(userID, id);

  if (savedActivity.userID !== userID) {
    throw newError(HttpStatus.Forbidden, ERROR_UNAUTHORIZED);
  }

  return ActivityModel.deleteByID(id);
};
