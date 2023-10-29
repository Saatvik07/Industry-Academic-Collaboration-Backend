import { ApiProperty } from '@nestjs/swagger';
import { OrgType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateOrganisationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  name: string;

  @IsEnum(OrgType)
  @ApiProperty({ default: OrgType.ACADEMIC })
  type: OrgType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location: string;
}
