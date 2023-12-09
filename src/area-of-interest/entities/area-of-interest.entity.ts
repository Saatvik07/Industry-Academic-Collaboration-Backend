import { ApiProperty } from '@nestjs/swagger';
import { AreaOfInterest, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class SearchResposeAOI implements AreaOfInterest {
  constructor(partial: Partial<SearchResposeAOI>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @Exclude()
  createAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  users: User[];

  @Exclude()
  createdByUserId: number;
}
