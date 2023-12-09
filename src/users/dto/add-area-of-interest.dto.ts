import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class AddAreaofInterestDto {
  @IsArray()
  @ApiProperty()
  areaOfInterestIds: Array<number>;
}

export class BulkAreaofInterestDto {
  @IsArray()
  @ApiProperty()
  areaOfInterestIds: Array<number>;

  @IsNumber()
  @ApiProperty()
  userId: number;
}
