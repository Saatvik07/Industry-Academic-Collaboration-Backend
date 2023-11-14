import { IProjectVerfication } from 'src/users/interfaces/user.interface';

export interface ITemplateData {
  firstName: string;
  lastName: string;
  url: string;
}

export interface IInvitationTemplateData extends ITemplateData {
  email: string;
  password: string;
}

export type IProjectVerificationTemplateData = IProjectVerfication;
