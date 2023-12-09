import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthBaseEntity, AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { IJwtConfig } from 'src/config/interfaces/jwt-config.interface';
import { MailerService } from 'src/mailer/mailer.service';
import { EmailDto } from './dto/email.dto';
import { UsersService } from 'src/users/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private mailerService: MailerService,
  ) {
    const jwtConfig = this.configService.get<IJwtConfig>('jwt');
    this.jwtSecret = jwtConfig.jwtSecret;
  }
  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.userService.findEmail(email);
    if (!user) throw new NotFoundException(`No user found for email: ${email}`);
    if (!user.isEmailVerified) {
      const confirmationToken = this.jwtService.sign(
        {
          email: user.email,
          id: user.userId,
        },
        {
          expiresIn: '180m',
        },
      );
      await this.mailerService.sendConfirmationEmail(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        confirmationToken,
      );
      throw new BadRequestException(
        'Email is not verified, a new email has been sent',
      );
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return {
      accessToken: this.jwtService.sign(
        {
          userId: user.userId,
          email: user.email,
        },
        {
          expiresIn: '5h',
        },
      ),
      refreshToken: this.jwtService.sign({
        userId: user.userId,
        email: user.email,
      }),
    };
  }

  async confirmEmail(confirmationToken: string) {
    const { email } = this.jwtService.verify(confirmationToken, {
      secret: this.jwtSecret,
    });

    const user = await this.userService.findEmail(email);
    if (!user) throw new NotFoundException('Email not found');
    return this.userService.update(user.userId, {
      isEmailVerified: true,
    });
  }

  async sendResetPasswordEmail(
    emailDto: EmailDto,
  ): Promise<{ success: boolean }> {
    const user = await this.userService.findEmail(emailDto.email);
    if (!user) throw new NotFoundException('User with email not found');
    const resetPasswordToken = this.jwtService.sign(
      {
        email: user.email,
        userId: user.userId,
      },
      {
        expiresIn: '60m',
      },
    );
    const result = await this.mailerService.sendResetPasswordEmail(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      resetPasswordToken,
    );
    if (result.success) return { success: true };
    return { success: false };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password1, password, resetToken } = resetPasswordDto;
    const { userId } = await this.jwtService.verify(resetToken, {
      secret: this.jwtSecret,
    });
    this.userService.comparePasswords(password1, password);
    return this.userService.update(userId, {
      password1,
    });
  }

  async getAccesssToken(refreshToken: string): Promise<AuthBaseEntity> {
    const { email } = this.jwtService.verify(refreshToken, {
      secret: this.jwtSecret,
    });

    const user = await this.userService.findEmail(email);
    if (!user) throw new UnauthorizedException('Refresh token is invalid');
    return {
      accessToken: this.jwtService.sign(
        {
          userId: user.userId,
          email: user.email,
        },
        {
          expiresIn: '1m',
        },
      ),
    };
  }
}
