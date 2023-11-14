import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddAreaofInterestDto {
  @IsArray()
  @ApiProperty()
  areaOfInterestIds: Array<number>;
}
