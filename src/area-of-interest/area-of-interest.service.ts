import { Injectable } from '@nestjs/common';
import { CreateAreaOfInterestDto } from './dto/create-area-of-interest.dto';
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
}
