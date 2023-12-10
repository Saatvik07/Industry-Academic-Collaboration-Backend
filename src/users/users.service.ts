import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateStudentUserDto,
  CreateUserDto,
  InviteUserDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateRandomString } from './users.utils';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

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

  public getConnectList<T>(idList: Array<T>) {
    return idList.map((id) => {
      return {
        id,
      };
    });
  }

  public getUserConnectList<T>(idList: Array<T>) {
    return idList.map((id) => {
      return {
        userId: id,
      };
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const {
      password1,
      password,
      firstName,
      lastName,
      orgId,
      role,
      email,
      website,
      department,
    } = createUserDto;
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
          website,
          department,
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

  async createSupervisee(
    createStudentUserDto: CreateStudentUserDto,
    orgId: number,
  ) {
    const exist = await this.findEmail(createStudentUserDto.email);
    if (!exist) {
      const password = generateRandomString(8);
      const hashedPassword = await bcrypt.hash(password, 10);
      let user;
      const studentUser = {
        ...createStudentUserDto,
        role: Role.ACADEMIC_STUDENT,
        orgId,
        password: hashedPassword,
        isVerified: true,
        isEmailVerified: false,
      };
      try {
        user = this.prisma.user.create({
          data: studentUser,
        });
      } catch (error) {
        throw new ForbiddenException(error);
      } finally {
        const result = await this.mailerService.sendPlatformInvitation({
          email: createStudentUserDto.email,
          firstName: createStudentUserDto.firstName,
          lastName: createStudentUserDto.lastName,
          password,
        });
        if (result.success) return user;
        else throw new InternalServerErrorException('Cannot send email');
      }
    } else {
      throw new BadRequestException('Cannot create student with this email');
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        organization: true,
        areaOfInterest: true,
      },
    });
  }

  findOne(userId: number) {
    return this.prisma.user.findUnique({
      where: { userId },
      include: {
        organization: true,
        areaOfInterest: true,
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

  findAreasOfInterest(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        userId,
      },
      include: {
        areaOfInterest: true,
      },
    });
  }

  searchUser(
    searchQuery: string,
    orgId: number,
    role: Role,
    areasOfInterest: Array<number>,
  ) {
    const searchObject = {};
    if (searchQuery && searchQuery !== '') {
      searchObject['OR'] = [
        {
          firstName: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      ];
    }
    if (orgId) {
      searchObject['AND'] = [{ orgId }];
    }
    if (role) {
      if (searchObject['AND'] && searchObject['AND'].length > 0) {
        searchObject['AND'].push({
          role,
        });
      } else {
        searchObject['AND'] = [{ role }];
      }
    }
    if (areasOfInterest && areasOfInterest.length) {
      const obj = {
        areaOfInterest: {
          some: {
            id: {
              in: areasOfInterest,
            },
          },
        },
      };
      if (searchObject['AND'] && searchObject['AND'].length > 0) {
        searchObject['AND'].push(obj);
      } else {
        searchObject['AND'] = [obj];
      }
    }
    return this.prisma.user.findMany({
      where: searchObject,
      include: {
        areaOfInterest: true,
        organization: true,
      },
    });
  }

  async addAreasOfInterest(userId: number, areasOfInterestIds: Array<number>) {
    return this.prisma.user.update({
      where: { userId },
      data: {
        areaOfInterest: {
          connect: this.getConnectList<number>(areasOfInterestIds),
        },
      },
      include: {
        areaOfInterest: true,
      },
    });
  }

  async getPotentialCollaborators(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        areaOfInterest: true,
      },
    });
    const areasofInterest = user.areaOfInterest.map((aoi) => aoi.id);

    if (areasofInterest && areasofInterest.length) {
      return this.prisma.user.findMany({
        where: {
          NOT: {
            userId,
          },
          areaOfInterest: {
            some: {
              id: {
                in: areasofInterest,
              },
            },
          },
        },
        include: {
          organization: true,
          areaOfInterest: true,
          academicProjects: true,
          industryProjects: true,
        },
      });
    }
    return Promise.resolve([]);
  }

  getSupervisees(userId: number) {
    return this.prisma.user.findUnique({
      where: { userId },
      include: {
        supervisees: true,
        supervisors: true,
        organization: true,
        areaOfInterest: true,
      },
    });
  }

  getUnverifiedUsers() {
    return this.prisma.user.findMany({
      where: {
        isVerified: false,
      },
      include: {
        organization: true,
        areaOfInterest: true,
      },
    });
  }

  verifyUser(memberIds: Array<number>) {
    return Promise.all(
      memberIds.map((memberId) => {
        return this.updateVerificationStatus(memberId, {
          isVerified: true,
        });
      }),
    );
  }

  makeUserPOC(memberIds: Array<number>) {
    return Promise.all(
      memberIds.map((memberId) => {
        return this.updateVerificationStatus(memberId, {
          isPoc: true,
        });
      }),
    );
  }

  async addSuperviseeSupervisorRelation(
    supervisorId: number,
    studentIds: Array<number>,
  ) {
    await this.prisma.user.update({
      where: { userId: supervisorId },
      data: {
        supervisees: {
          connect: this.getUserConnectList<number>(studentIds),
        },
      },
      include: {
        supervisees: true,
        supervisors: true,
      },
    });
    return Promise.all(
      studentIds.map((studentId) => {
        return this.prisma.user.update({
          where: { userId: studentId },
          data: {
            supervisors: {
              connect: this.getUserConnectList<number>([supervisorId]),
            },
          },
          include: {
            supervisors: true,
            supervisees: true,
          },
        });
      }),
    );
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password1) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password1, 10);
      updateUserDto.password = hashedPassword;
      delete updateUserDto.password1;
    }
    if (updateUserDto.areasofInterest && updateUserDto.areasofInterest.length) {
      await this.prisma.user.update({
        where: { userId },
        data: {
          areaOfInterest: {
            connect: this.getConnectList(updateUserDto.areasofInterest),
          },
        },
      });
      delete updateUserDto.areasofInterest;
    }

    return this.prisma.user.update({
      where: { userId },
      data: updateUserDto,
    });
  }

  async updateVerificationStatus(userId: number, updateUserDto: UpdateUserDto) {
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

  async inviteUser(inviteUserDto: InviteUserDto) {
    const password = generateRandomString(8);
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    const pocUser = {
      ...inviteUserDto,
      password: hashedPassword,
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
        email: inviteUserDto.email,
        firstName: inviteUserDto.firstName,
        lastName: inviteUserDto.lastName,
        password,
      });
      if (result.success) return user;
      else throw new InternalServerErrorException('Cannot send email');
    }
  }
}
