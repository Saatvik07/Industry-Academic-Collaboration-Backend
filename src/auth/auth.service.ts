import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthBaseEntity, AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { IJwtConfig } from 'src/config/interfaces/jwt-config.interface';
@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const jwtConfig = this.configService.get<IJwtConfig>('jwt');
    this.jwtSecret = jwtConfig.jwtSecret;
  }
  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException(`No user found for email: ${email}`);
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
          expiresIn: '2m',
        },
      ),
      refreshToken: this.jwtService.sign({
        userId: user.userId,
        email: user.email,
      }),
    };
  }

  async getAccesssToken(refreshToken: string): Promise<AuthBaseEntity> {
    const { email } = this.jwtService.verify(refreshToken, {
      secret: this.jwtSecret,
    });

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
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
