import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IEmailConfig } from 'src/config/interfaces/email-config.interface';
import {
  IProjectVerificationTemplateData,
  ITemplateData,
} from './interfaces/template-data.interface';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import { ITemplates } from './interfaces/templates.interface';
import {
  IProjectVerfication,
  IUser,
  IUserInvitation,
} from 'src/users/interfaces/user.interface';

@Injectable()
export class MailerService {
  private readonly loggerService: LoggerService;
  private readonly transport: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly email: string;
  private readonly domain: string;
  private readonly templates: ITemplates;

  constructor(private readonly configService: ConfigService) {
    const emailConfig = this.configService.get<IEmailConfig>('emailService');
    this.transport = createTransport(emailConfig);
    this.email = `"Industry-Academic Collaboration" <${emailConfig.auth.user}>`;
    this.domain = this.configService.get<string>('domain');
    this.loggerService = new Logger(MailerService.name);
    // templates
    this.templates = {
      confirmation:
        MailerService.parseTemplate<ITemplateData>('confirmation.hbs'),
      resetPassword:
        MailerService.parseTemplate<ITemplateData>('resetPassword.hbs'),
      platformInvitation: MailerService.parseTemplate<ITemplateData>(
        'platformInvitation.hbs',
      ),
      projectVerification:
        MailerService.parseTemplate<IProjectVerificationTemplateData>(
          'projectVerification.hbs',
        ),
    };
  }

  private static parseTemplate<TemplateType>(
    templateName: string,
  ): Handlebars.TemplateDelegate<TemplateType> {
    const templateText = readFileSync(
      join(__dirname, '../../mailer/templates', templateName),
      'utf-8',
    );
    return Handlebars.compile<TemplateType>(templateText, { strict: true });
  }

  public sendEmail(to: string, subject: string, html: string, log?: string) {
    return this.transport
      .sendMail({
        from: this.email,
        to,
        subject,
        html,
      })
      .then(() => {
        this.loggerService.log(
          log ?? `Email sent to ${to}, subject:${subject}`,
        );
        return { success: true };
      })
      .catch((error) => this.loggerService.error(error));
  }

  public sendConfirmationEmail(user: IUser, token: string) {
    const { email, firstName, lastName } = user;
    const subject = 'Confirm your email';
    const html = this.templates.confirmation({
      firstName,
      lastName,
      url: `https://${this.domain}/auth/confirm/${token}`,
    });
    return this.sendEmail(
      email,
      subject,
      html,
      `A new confirmation email was sent to ${firstName} ${lastName}, ${email}`,
    );
  }

  public sendResetPasswordEmail(user: IUser, token: string) {
    const { email, firstName, lastName } = user;
    const subject = 'Reset your password';
    const html = this.templates.resetPassword({
      firstName,
      lastName,
      url: `https://${this.domain}/auth/reset-password/${token}`,
    });
    return this.sendEmail(
      email,
      subject,
      html,
      `A new reset password email was sent to ${firstName} ${lastName}, ${email}`,
    );
  }

  public sendPlatformInvitation(user: IUserInvitation) {
    const { email, firstName, lastName, password } = user;
    const subject =
      'You have been invited to Industry-Academic Collaboration Platform';
    const html = this.templates.platformInvitation({
      firstName,
      lastName,
      password,
      email,
      url: `https://${this.domain}/login`,
    });
    return this.sendEmail(
      email,
      subject,
      html,
      `A new invitation email was sent to ${firstName} ${lastName}, ${email}`,
    );
  }

  public sendProjectVerficationEmail(
    props: IProjectVerfication,
    token: string,
  ) {
    const {
      firstName,
      lastName,
      inviterFirstName,
      inviterLastName,
      projectName,
      email,
    } = props;
    const subject =
      'You have been invited to a project on  Industry-Academic Collaboration Platform';
    const html = this.templates.projectVerification({
      firstName,
      lastName,
      inviterFirstName,
      inviterLastName,
      projectName,
      email,
      url: `https://${this.domain}/projectVerification/${token}`,
    });
    return this.sendEmail(
      email,
      subject,
      html,
      `A new project verification email was sent to ${firstName} ${lastName}, ${email}`,
    );
  }
}
