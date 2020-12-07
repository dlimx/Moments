import { UserModel } from './model';
import { IUserData } from '../../types/user';

export const createUser = async (payload: IUserData) => UserModel.create(payload);

export const getUsers = async () => UserModel.getAllUsers();
