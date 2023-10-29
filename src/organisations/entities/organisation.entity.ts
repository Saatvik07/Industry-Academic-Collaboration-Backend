import { ApiProperty } from '@nestjs/swagger';
import { OrgType, Organization, User } from '@prisma/client';

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
