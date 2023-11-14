import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

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

  @IsDate()
  @ApiProperty()
  startDate: Date;

  @IsDate()
  @ApiProperty()
  endDate: Date;
}
