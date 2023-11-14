export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUserInvitation extends IUser {
  password: string;
}

export interface IProjectVerfication {
  email: string;
  firstName: string;
  lastName: string;
  inviterFirstName: string;
  inviterLastName: string;
  projectName: string;
  url: string;
}
