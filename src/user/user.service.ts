import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JWTPayload } from 'src/auth/dto/auth.dto';
import { ErrorHandler } from 'src/utils';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

const getOne = {
  id: true,
  name: true,
  role: {
    select: {
      id: true,
      title: true,
    },
  },
  parent: {
    select: {
      id: true,
      name: true,
    },
  },
  subUsers: {
    select: {
      id: true,
      name: true,
      ageRemark: true,
      contact: { select: { email: true } },
    },
  },
  contact: { select: { email: true } },
  balance: true,
  ageRemark: true,
  lastSubscription: true,
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateUserDto, payload: JWTPayload): Promise<User> {
    const contact = await this.prisma.contact.findUnique({
      where: { email: params.email },
    });

    if (contact)
      return ErrorHandler(409, null, `${params.email} is already in use`);

    if (payload.role.id > params.roleId) {
      return ErrorHandler(
        403,
        null,
        "You don't have permission to assign this role",
      );
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          name: params.name.trim(),
          role: { connect: { id: params.roleId } },
          parent: { connect: { id: payload.userId } },
          balance: params.balance,
          ageRemark: params.ageRemark,
          contact: {
            create: {
              email: params.email,
            },
          },
          password: await bcrypt.hash(params.password, 12),
        },
        select: getOne,
      });

      return user;
    } catch (e) {
      return ErrorHandler(500, null, e);
    }
  }

  async findAll() {
    return `This action returns all user`;
  }

  async findByToken(id: number) {
    return this.prisma.user.findUnique({ where: { id }, select: getOne });
  }

  async update(
    id: number,
    params: UpdateUserDto,
    payload: JWTPayload,
  ): Promise<User> {
    const candidate = await this.prisma.user.findUnique({
      where: { id },
      include: { contact: { select: { email: true } } },
    });

    if (!candidate)
      return ErrorHandler(404, null, `User with id ${id} not found`);

    const data: Prisma.UserUpdateInput = {};

    if (params.email && candidate.contact.email !== params.email) {
      const contact = await this.prisma.contact.findUnique({
        where: { email: params.email },
      });

      if (contact)
        return ErrorHandler(409, null, `${params.email} is already in use`);

      data.contact = { connect: { email: params.email } };
    }

    if (params.roleId && candidate.roleId !== params.roleId) {
      if (payload.role.id > params.roleId) {
        return ErrorHandler(
          403,
          null,
          "You don't have permission to assign this role",
        );
      }

      data.role = { connect: { id: params.roleId } };
    }

    if (params.name.trim() && candidate.name !== params.name.trim()) {
      data.name = params.name.trim();
    }

    if (params.balance && candidate.balance !== params.balance) {
      data.balance = params.balance;
    }

    if (params.ageRemark && candidate.ageRemark !== params.ageRemark) {
      data.ageRemark = params.ageRemark;
    }

    if (params.password) {
      const equals = await bcrypt.compare(params.password, candidate.password);

      if (!equals) data.password = await bcrypt.hash(params.password, 12);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: candidate.id },
        data,
        select: getOne,
      });

      return user;
    } catch (e) {
      return ErrorHandler(500, null, e);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({ where: { id } });

      return { status: 200, message: 'Success' };
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }
}
