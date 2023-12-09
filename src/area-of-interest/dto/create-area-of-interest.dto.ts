import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class GetAOIQueryParams {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  searchQuery?: string;
}
export class CreateAreaOfInterestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty()
  description: string;
}
