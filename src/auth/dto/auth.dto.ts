import { OmitType } from '@nestjs/mapped-types';
import { User } from '@prisma/client';
import { IsEmail, IsNotEmptyObject, IsString } from 'class-validator';

export class RegistrationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginDto extends OmitType(RegistrationDto, ['name'] as const) {}

export class AuthenticatedUser {
  @IsNotEmptyObject()
  user: User;

  @IsString()
  jwt: string;
}

export class JWTPayload {
  userId: number;
  email: string;
  role: { id: number; title: string };
}
