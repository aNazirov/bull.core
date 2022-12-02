import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmptyObject, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Enums } from 'src/utils';

export class RegistrationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;
}

export class LoginDto extends OmitType(RegistrationDto, [
  'name',
  'email',
  'phone',
] as const) {
  @IsString()
  login: string;
}

export class AuthenticatedUser {
  @IsNotEmptyObject()
  user: User;

  @IsString()
  jwt: string;
}

export class JWTPayload {
  userId: number;
  email: string;
  role: { id: Enums.RoleType };
}
