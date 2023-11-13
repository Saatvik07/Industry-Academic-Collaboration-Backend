import { Injectable } from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrgType } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class OrganisationsService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  create(createOrganisationDto: CreateOrganisationDto) {
    return this.prisma.organization.create({
      data: createOrganisationDto,
    });
  }

  findAll() {
    return this.prisma.organization.findMany({
      select: {
        id: true,
        location: true,
        type: true,
        name: true,
      },
    });
  }

  findAcademicOrganisations() {
    return this.prisma.organization.findMany({
      where: {
        type: OrgType.ACADEMIC,
      },
      select: {
        id: true,
        location: true,
        type: true,
        name: true,
      },
    });
  }

  findIndustryOrganisations() {
    return this.prisma.organization.findMany({
      where: {
        type: OrgType.INDUSTRY,
      },
      select: {
        id: true,
        location: true,
        type: true,
        name: true,
      },
    });
  }

  findUnverifiedOrganizationMembers(orgId: number) {
    return this.prisma.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        _count: {
          select: {
            users: {
              where: {
                isVerified: false,
              },
            },
          },
        },
        users: {
          where: {
            isVerified: false,
          },
          orderBy: {
            createAt: 'desc',
          },
        },
      },
    });
  }

  findVerifiedOrganizationMembers(orgId: number) {
    return this.prisma.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        _count: {
          select: {
            users: {
              where: {
                isVerified: true,
              },
            },
          },
        },
        users: {
          where: {
            isVerified: true,
          },
          orderBy: {
            createAt: 'desc',
          },
        },
      },
    });
  }

  findOrganizationPOC(orgId: number) {
    return this.prisma.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        _count: {
          select: {
            users: {
              where: {
                isPoc: true,
              },
            },
          },
        },
        users: {
          where: {
            isPoc: true,
          },
          orderBy: {
            createAt: 'desc',
          },
        },
      },
    });
  }

  verifyOrganizationMembers(memberIds: Array<number>, orgId: number) {
    return Promise.all(
      memberIds.map((memberId) => {
        return this.userService.updateVerificationStatus(memberId, orgId, {
          isVerified: true,
        });
      }),
    );
  }

  findOne(id: number) {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  update(id: number, updateOrganisationDto: UpdateOrganisationDto) {
    return this.prisma.organization.update({
      where: { id },
      data: updateOrganisationDto,
    });
  }

  remove(id: number) {
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}
