import { ApiProperty } from '@nestjs/swagger';
import { IsArray, MinLength } from 'class-validator';
export class VerifyMemberDto {
  @IsArray()
  @MinLength(1)
  @ApiProperty()
  memberIds: Array<number>;
}
