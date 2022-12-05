import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { appConfiguration } from 'config/config';
import { User } from 'src/user/entities/user.entity';
import { getFull } from 'src/user/user.service';
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
      where: { OR: [{ email: params.login }, { phone: params.login }] },
      select: { ...getFull, password: true },
    });

    if (user == null) return null;

    const password = user.password;

    delete user.password;

    if (await bcrypt.compare(params.password, password)) {
      return user;
    }

    return null;
  }

  async getToken(user: User) {
    return this.jwtService.sign(
      { uId: user.id },
      {
        secret: appConfiguration().jwtSecret,
        expiresIn: '3d',
      },
    );
  }

  async authentication(params: LoginDto): Promise<AuthenticatedUser> {
    const user = await this.validateUser(params);

    if (!user) {
      return ErrorHandler(400, null, 'Invalid login or password');
    }

    const jwt = await this.getToken(user);

    return {
      jwt,
      user,
    };
  }

  async registration(params: RegistrationDto): Promise<AuthenticatedUser> {
    const candidate = await this.prisma.user.findFirst({
      where: { OR: [{ email: params.email }, { phone: params.phone }] },
    });

    if (candidate)
      return ErrorHandler(
        409,
        null,
        `${params.email} user with this mail or phone already exist`,
      );

    const user = await this.prisma.user.create({
      data: {
        name: params.name.trim(),
        email: params.email,
        phone: params.phone,
        password: await bcrypt.hash(params.password, 12),
        role: { connect: { id: Enums.RoleType.User } },
      },
      select: getFull,
    });

    const jwt = await this.getToken(user);

    return {
      jwt,
      user,
    };
  }
}
