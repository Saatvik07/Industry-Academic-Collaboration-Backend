import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateDraftProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty()
  summary: string;

  @IsString()
  @ApiProperty()
  startDate: string;

  @IsString()
  @ApiProperty()
  endDate?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  projectProposalLink?: string;

  @IsArray()
  @ApiProperty()
  areasOfInterest: Array<number>;

  @IsArray()
  @ApiProperty()
  @IsOptional()
  progressUpdates?: Array<string>;
}

export class AddAcademicUserDto {
  @IsArray()
  @ApiProperty()
  academicUsersId: Array<number>;
}

export class AddIndustryUserDto {
  @IsArray()
  @ApiProperty()
  industryUsersId: Array<number>;
}
