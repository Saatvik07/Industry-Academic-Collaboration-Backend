import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { PasswordsDto } from 'src/auth/dto/passwords.dto';

export class CreatePOCUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty()
  role: Role;

  @IsNumber()
  @ApiProperty()
  orgId: number;

  @IsBoolean()
  @ApiProperty()
  isEmailVerified: boolean;
}

export class CreateUserDto extends PasswordsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty()
  role: Role;

  @IsNumber()
  @ApiProperty()
  orgId: number;

  @IsBoolean()
  @ApiProperty()
  isEmailVerified: boolean;
}
