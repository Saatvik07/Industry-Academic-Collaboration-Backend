import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class VerifyProjectDto {
  @IsJWT()
  @ApiProperty()
  verificationToken: string;
}
