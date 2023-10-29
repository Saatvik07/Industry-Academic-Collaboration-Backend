import { Injectable } from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrgType } from '@prisma/client';

@Injectable()
export class OrganisationsService {
  constructor(private prisma: PrismaService) {}

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
