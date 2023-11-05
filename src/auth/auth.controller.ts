import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthBaseEntity, AuthEntity } from './entity/auth.entity';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { ICookieConfig } from 'src/config/interfaces/cookie-config.interface';

@Controller('auth')
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
  @ApiOkResponse({ type: AuthEntity })
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
}
