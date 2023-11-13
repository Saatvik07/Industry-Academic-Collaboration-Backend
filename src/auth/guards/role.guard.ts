import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/role.decorator';
import { UsersService } from 'src/users/users.service';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express-serve-static-core';
import { isJWT } from 'class-validator';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const activate = await this.setHttpHeader(
      context.switchToHttp().getRequest(),
      isPublic,
    );

    if (!activate) {
      throw new UnauthorizedException();
    }

    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { userId } = request.user;
    const user = await this.userService.findOne(userId);
    return this.matchRoles(roles, user.role);
  }

  private matchRoles(roles: Array<string>, userRole: Role) {
    return roles.includes(userRole);
  }

  /**
   * Sets HTTP Header
   *
   * Checks if the header has a valid Bearer token, validates it and sets the User ID as the user.
   */
  private async setHttpHeader(
    req: Request,
    isPublic: boolean,
  ): Promise<boolean> {
    const auth = req.headers?.authorization;
    if (!auth || auth.length === 0) {
      return isPublic;
    }

    const authArr = auth.split(' ');
    const bearer = authArr[0];
    const token = authArr[1];

    if (!bearer || bearer !== 'Bearer') {
      return isPublic;
    }
    if (!token || !isJWT(token)) {
      return isPublic;
    }

    try {
      const { userId, email } = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.jwtSecret'),
      });
      req.user = {
        userId,
        email,
      };
      return true;
    } catch (_) {
      return isPublic;
    }
  }
}
