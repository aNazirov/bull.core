import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance: number;

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Min(0)
  ageRemark: number;

  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
