import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
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

  @IsNumber()
  @ApiProperty()
  startDate: number;

  @IsNumber()
  @ApiProperty()
  endDate?: number;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  projectProposalLink?: string;

  @IsArray()
  @ApiProperty()
  areasOfInterest: Array<number>;
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
