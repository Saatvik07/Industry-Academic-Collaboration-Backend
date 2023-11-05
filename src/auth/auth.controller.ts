import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthBaseEntity, AuthEntity } from './entity/auth.entity';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(email, password);
    response
      .cookie(process.env.REFRESH_COOKIE, tokens.refreshToken, {
        httpOnly: true,
      })
      .json({
        accessToken: tokens.accessToken,
      });
  }

  @Post('getAccessToken')
  @ApiOkResponse({ type: AuthBaseEntity })
  async getAccessToken(@Req() req: Request) {
    const refreshToken = req.cookies[process.env.REFRESH_COOKIE];
    return this.authService.getAccesssToken(refreshToken);
  }
}
