import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePOCUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateRandomString } from './users.utils';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  public comparePasswords(password1: string, password2: string): void {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }
  async createUser(createUserDto: CreateUserDto) {
    const { password1, password, firstName, lastName, orgId, role, email } =
      createUserDto;
    this.comparePasswords(password1, password);
    const hashedPassword = await bcrypt.hash(password1, 10);
    let user;
    try {
      user = this.prisma.user.create({
        data: {
          firstName,
          lastName,
          orgId,
          role,
          email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    } finally {
      const confirmationToken = this.jwtService.sign(
        {
          email: createUserDto.email,
        },
        {
          expiresIn: '60m',
        },
      );
      const result = await this.mailerService.sendConfirmationEmail(
        {
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
        },
        confirmationToken,
      );
      if (result.success) return user;
      else throw new InternalServerErrorException('Cannot send email');
    }
  }
  async createPOCUser(createPOCUserDto: CreatePOCUserDto) {
    const password = generateRandomString(8);
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    const pocUser = {
      ...createPOCUserDto,
      password: hashedPassword,
      isPoc: true,
      isVerified: true,
      isEmailVerified: true,
    };
    try {
      user = this.prisma.user.create({
        data: pocUser,
      });
    } catch (error) {
      throw new ForbiddenException(error);
    } finally {
      const result = await this.mailerService.sendPlatformInvitation({
        email: createPOCUserDto.email,
        firstName: createPOCUserDto.firstName,
        lastName: createPOCUserDto.lastName,
        password,
      });
      if (result.success) return user;
      else throw new InternalServerErrorException('Cannot send email');
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(userId: number) {
    return this.prisma.user.findUnique({
      where: { userId },
      include: {
        organization: true,
      },
    });
  }

  findEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password1) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password1, 10);
      updateUserDto.password = hashedPassword;
      delete updateUserDto.password1;
    }
    return this.prisma.user.update({
      where: { userId },
      data: updateUserDto,
    });
  }

  remove(userId: number) {
    return this.prisma.user.delete({
      where: { userId },
    });
  }
}
