import { IConfig } from './interfaces/config.interface';

export function config(): IConfig {
  return {
    port: parseInt(process.env.PORT, 10),
    domain: process.env.DOMAIN,
    emailService: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
    cookie: {
      cookieName: process.env.REFRESH_COOKIE_NAME,
      cookieSecret: process.env.COOKIE_SECRET,
    },
    jwt: {
      jwtSecret: process.env.JWT_SECRET,
    },
  };
}
