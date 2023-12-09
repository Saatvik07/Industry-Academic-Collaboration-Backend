import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PasswordsDto } from 'src/auth/dto/passwords.dto';

export class IStudentInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export class GetUserQueryParams {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  orgId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  searchQuery?: string;
}
export class AddSuperviseesDto {
  @IsArray()
  @Type(() => Number)
  @ApiProperty()
  supervisees: Array<number>;
}

export class CreateStudentUserDto {
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

  @IsString()
  @IsOptional()
  @ApiProperty()
  website?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  department?: string;

  @IsBoolean()
  @ApiProperty()
  isEmailVerified?: boolean;

  @IsBoolean()
  @ApiProperty()
  isVerified?: boolean;

  @IsBoolean()
  @ApiProperty()
  isPoc?: boolean;

  @IsArray()
  @ApiProperty()
  areasofInterest?: Array<number>;
}
