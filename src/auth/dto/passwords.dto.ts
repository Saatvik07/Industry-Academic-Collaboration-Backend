import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class PasswordsDto {
  @IsString()
  @MinLength(6)
  @ApiProperty()
  public password!: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  public password1!: string;
}
