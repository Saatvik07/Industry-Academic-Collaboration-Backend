import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthBaseEntity } from './entity/auth.entity';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { ICookieConfig } from 'src/config/interfaces/cookie-config.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { Public } from './decorators/public.decorator';
import { Request } from 'express-serve-static-core';

@Controller('auth')
@Public()
@ApiTags('auth')
export class AuthController {
  private readonly refreshCookieName;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const cookieConfig = this.configService.get<ICookieConfig>('cookie');
    this.refreshCookieName = cookieConfig.cookieName;
  }

  @Post('login')
  @ApiCreatedResponse({ type: AuthBaseEntity })
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(email, password);
    response
      .cookie(this.refreshCookieName, tokens.refreshToken, {
        httpOnly: true,
      })
      .json({
        accessToken: tokens.accessToken,
      });
  }

  @Post('getAccessToken')
  @ApiOkResponse({ type: AuthBaseEntity })
  async getAccessToken(@Req() req: Request) {
    const refreshToken = req.cookies[this.refreshCookieName];
    return this.authService.getAccesssToken(refreshToken);
  }

  @Post('confirmEmail')
  @ApiOkResponse({ type: UserEntity })
  async confirmEmail(@Body() { confirmationToken }: ConfirmEmailDto) {
    return this.authService.confirmEmail(confirmationToken);
  }

  @Post('sendResetPasswordEmail')
  @ApiOkResponse()
  async resetPasswordEmail(@Body() emailDto: EmailDto) {
    const response = await this.authService.sendResetPasswordEmail(emailDto);
    if (response.success) return response;
    throw new BadRequestException('Cannot send mail');
  }

  @Post('resetPassword')
  @ApiOkResponse({ type: UserEntity })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
