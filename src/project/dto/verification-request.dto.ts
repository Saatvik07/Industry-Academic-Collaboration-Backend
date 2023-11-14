import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VerificationRequestDto {
  @IsNumber()
  @ApiProperty()
  industryUserId: number;

  @IsNumber()
  @ApiProperty()
  industryOrgId: number;

  @IsNumber()
  @ApiProperty()
  projectId: number;
}
