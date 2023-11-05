export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUserInvitation extends IUser {
  password: string;
}
