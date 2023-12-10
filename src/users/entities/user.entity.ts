import { ApiProperty } from '@nestjs/swagger';
import { AreaOfInterest, Organization, Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class SearchResponseUser implements User {
  constructor(partial: Partial<SearchResponseUser>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  userId: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  createAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  role: Role;

  @ApiProperty()
  orgId: number;

  @ApiProperty()
  org: Organization;

  @Exclude()
  isPoc: boolean;

  @Exclude()
  isVerified: boolean;

  @Exclude()
  isEmailVerified: boolean;

  @ApiProperty()
  areaOfInterest?: AreaOfInterest[];

  @ApiProperty()
  website: string;

  @ApiProperty()
  department: string;
}
export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  userId: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  orgId: number;

  @ApiProperty({ default: false })
  isPoc: boolean;

  @ApiProperty({ default: false })
  isVerified: boolean;

  @ApiProperty({ default: false })
  isEmailVerified: boolean;

  @ApiProperty()
  areaOfInterest?: AreaOfInterest[];

  @ApiProperty()
  organization?: Organization;

  @ApiProperty()
  website: string;

  @ApiProperty()
  department: string;
}
