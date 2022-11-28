import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEmail()
  phone: string;

  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsNumber()
  avatarId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance: number;

  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
