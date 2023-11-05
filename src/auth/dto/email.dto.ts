import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export abstract class EmailDto {
  @IsString()
  @IsEmail()
  @Length(5, 255)
  @ApiProperty()
  public email: string;
}
