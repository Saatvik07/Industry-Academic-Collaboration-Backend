import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException(`No user found for email: ${email}`);
    const isValid = await bcrypt.compare(password, user.password);
    console.log(user.password, password, isValid);
    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return {
      accessToken: this.jwtService.sign({
        userId: user.userId,
        email: user.email,
      }),
    };
  }
}
