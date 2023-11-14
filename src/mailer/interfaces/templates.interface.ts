import { TemplateDelegate } from 'handlebars';
import {
  IInvitationTemplateData,
  IProjectVerificationTemplateData,
  ITemplateData,
} from './template-data.interface';
export interface ITemplates {
  confirmation: TemplateDelegate<ITemplateData>;
  resetPassword: TemplateDelegate<ITemplateData>;
  platformInvitation: TemplateDelegate<IInvitationTemplateData>;
  projectVerification: TemplateDelegate<IProjectVerificationTemplateData>;
}
