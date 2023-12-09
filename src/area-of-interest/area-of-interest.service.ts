import { Injectable } from '@nestjs/common';
import {
  CreateAreaOfInterestBulkDto,
  CreateAreaOfInterestDto,
} from './dto/create-area-of-interest.dto';
import { UpdateAreaOfInterestDto } from './dto/update-area-of-interest.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AreaOfInterestService {
  constructor(private prisma: PrismaService) {}
  create(createAreaOfInterestDto: CreateAreaOfInterestDto, userId: number) {
    return this.prisma.areaOfInterest.create({
      data: {
        ...createAreaOfInterestDto,
        createdByUserId: userId,
      },
    });
  }

  createBulk(
    createAreaOfInterestDto: CreateAreaOfInterestBulkDto,
    userId: number,
  ) {
    const { aoiList } = createAreaOfInterestDto;
    const bulkCreatePayload = aoiList.map(({ title, description }) => {
      return {
        title,
        description,
        createdByUserId: userId,
      };
    });
    return this.prisma.areaOfInterest.createMany({
      data: bulkCreatePayload,
    });
  }

  findAll() {
    return this.prisma.areaOfInterest.findMany();
  }

  findOne(id: number) {
    return this.prisma.areaOfInterest.findUnique({
      where: { id },
    });
  }

  update(
    id: number,
    updateAreaOfInterestDto: UpdateAreaOfInterestDto,
    userId: number,
  ) {
    return this.prisma.areaOfInterest.update({
      where: { id, createdByUserId: userId },
      data: updateAreaOfInterestDto,
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.areaOfInterest.delete({
      where: { id, createdByUserId: userId },
    });
  }

  searchAOI(searchQuery: string) {
    const searchObject = {};
    if (searchQuery && searchQuery !== '') {
      searchObject['OR'] = [
        {
          title: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      ];
    }
    return this.prisma.areaOfInterest.findMany({
      where: searchObject,
    });
  }
}
