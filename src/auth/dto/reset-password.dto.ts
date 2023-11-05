import { IsJWT, IsString } from 'class-validator';
import { PasswordsDto } from './passwords.dto';
import { ApiProperty } from '@nestjs/swagger';

export abstract class ResetPasswordDto extends PasswordsDto {
  @IsString()
  @IsJWT()
  @ApiProperty()
  public resetToken!: string;
}
