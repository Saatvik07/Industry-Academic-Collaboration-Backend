import { ApiProperty } from '@nestjs/swagger';
import { OrgType, Organization, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class SearchResponseOrg implements Organization {
  constructor(partial: Partial<SearchResponseOrg>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: OrgType;

  @ApiProperty()
  location: string;

  @Exclude()
  createAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  users: User[];
}

export class OrganisationEntity implements Organization {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: OrgType;

  @ApiProperty()
  location: string;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  users: User[];
}
