import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export abstract class ConfirmEmailDto {
  @IsString()
  @IsJWT()
  @ApiProperty()
  public confirmationToken!: string;
}
