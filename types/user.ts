export interface IUserData {
  name: string;
  email: string;
  password?: string;
}

export interface IUser extends IUserData {
  id: number;
  token?: string;
  self?: string;
}
