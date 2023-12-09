import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
export class VerifyUserDto {
  @IsArray()
  @Type(() => Number)
  @ApiProperty()
  memberIds: Array<number>;
}
