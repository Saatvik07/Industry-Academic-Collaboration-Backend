import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
export class VerifyMemberDto {
  @IsArray()
  @ApiProperty()
  memberIds: Array<number>;
}
