import { ICookieConfig } from './cookie-config.interface';
import { IEmailConfig } from './email-config.interface';
import { IJwtConfig } from './jwt-config.interface';

export interface IConfig {
  domain: string;
  port: number;
  emailService: IEmailConfig;
  cookie: ICookieConfig;
  jwt: IJwtConfig;
}
