import { IUserData, UserModel } from './model';

export const createUser = async (payload: IUserData) => UserModel.create(payload);

export const getUsers = async () => UserModel.getAllUsers();
