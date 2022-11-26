import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { appConfiguration } from 'config/config';
import { Enums, ErrorHandler } from 'src/utils';
import { AuthenticatedUser, LoginDto, RegistrationDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(params: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { contact: { email: params.email } },
      include: { contact: { select: { email: true } } },
    });

    if (user == null) return null;

    if (await bcrypt.compare(params.password, user.password)) {
      return user;
    }

    return null;
  }

  async getToken(user: User & { contact: { email: string } }) {
    return this.jwtService.sign(
      { uId: user.id, eId: user.contact.email },
      {
        secret: appConfiguration().jwtSecret,
      },
    );
  }

  async authentication(params: LoginDto): Promise<AuthenticatedUser> {
    const user = await this.validateUser(params);

    if (!user) {
      return ErrorHandler(400, null, 'Invalid login or password');
    }

    const jwt = await this.getToken(user);

    delete user.password;

    return {
      jwt,
      user,
    };
  }

  async registration(params: RegistrationDto): Promise<AuthenticatedUser> {
    const contact = await this.prisma.contact.findUnique({
      where: { email: params.email },
    });

    if (contact)
      return ErrorHandler(409, null, `${params.email} is already in use`);

    const user = await this.prisma.user.create({
      data: {
        name: params.name.trim(),
        contact: { create: { email: params.email } },
        password: await bcrypt.hash(params.password, 12),
        role: { connect: { title: Enums.RoleType.User } },
      },
      include: { contact: { select: { email: true } } },
    });

    const jwt = await this.getToken(user);

    delete user.password;

    return {
      jwt,
      user,
    };
  }
}
