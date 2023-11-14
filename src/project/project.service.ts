import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDraftProjectDto } from './dto/create-project.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { Project, ProjectStatus, User } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IJwtConfig } from 'src/config/interfaces/jwt-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProjectService {
  private readonly jwtSecret: string;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const jwtConfig = this.configService.get<IJwtConfig>('jwt');
    this.jwtSecret = jwtConfig.jwtSecret;
  }

  async createDraftProject(
    createDraftProject: CreateDraftProjectDto,
    userId: number,
  ) {
    const { title, summary, startDate, endDate } = createDraftProject;
    const user = await this.userService.findOne(userId);
    return this.prisma.project.create({
      data: {
        title,
        summary,
        startDate,
        endDate,
        academicOrgId: user.orgId,
        academicUsers: {
          connect: {
            userId,
          },
        },
      },
    });
  }

  async sendVerificationProjectRequest(
    industryUserId: number,
    academicUserId: number,
    industryOrgId: number,
    projectId: number,
  ) {
    let industryUser: User, academicUser: User;
    let project: Project;
    try {
      project = await this.prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          industryOrgId,
          industryUsers: {
            connect: { userId: industryUserId },
          },
          status: ProjectStatus.VERFICATION_PENDING,
        },
      });
      industryUser = await this.userService.findOne(industryUserId);
      academicUser = await this.userService.findOne(academicUserId);
    } catch (error) {
      throw new ForbiddenException(error);
    } finally {
      const projectVerifactionToken = this.jwtService.sign({
        projectId,
      });
      const result = await this.mailerService.sendProjectVerficationEmail(
        {
          firstName: industryUser.firstName,
          lastName: industryUser.lastName,
          inviterFirstName: academicUser.firstName,
          inviterLastName: academicUser.lastName,
          projectName: project.title,
          email: industryUser.email,
          url: '',
        },
        projectVerifactionToken,
      );
      if (result.success) return project;
      else throw new InternalServerErrorException('Cannot send email');
    }
  }

  async verifyProject(token: string) {
    const { projectId } = await this.jwtService.verify(token, {
      secret: this.jwtSecret,
    });
    this.updatProjectStatus(projectId, ProjectStatus.ONGOING);
  }

  findAllLiveProject() {
    return this.prisma.project.findMany({
      where: {
        status: ProjectStatus.ONGOING,
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany();
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  updatProjectStatus(id: number, status: ProjectStatus) {
    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
