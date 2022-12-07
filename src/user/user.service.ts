import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JWTPayload } from 'src/auth/dto/auth.dto';
import { FileService } from 'src/file/file.service';
import { ErrorHandler } from 'src/utils';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

export const getFull = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: {
    select: {
      id: true,
      title: true,
    },
  },
  avatar: {
    select: {
      id: true,
      name: true,
      url: true,
    },
  },
  banners: {
    select: {
      id: true,
      type: {
        select: {
          id: true,
          name: true,
          size: true,
          index: true,
          position: true,
          component: true,
        },
      },
      clicked: true,
    },
  },
  contexts: { select: { id: true, title: true, url: true, clicked: true } },
  chains: { select: { id: true, title: true, url: true, clicked: true } },
  balance: true,
  deleted: true,
};

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  async create(params: CreateUserDto, payload: JWTPayload): Promise<User> {
    const candidate = await this.prisma.user.findFirst({
      where: { email: params.email },
    });

    if (candidate)
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
          balance: params.balance,
          email: params.email,
          phone: params.phone,
          password: await bcrypt.hash(params.password, 12),
          ...(params.avatarId
            ? { avatar: { connect: { id: params.avatarId } } }
            : {}),
        },
        select: getFull,
      });

      return user;
    } catch (e) {
      return ErrorHandler(500, null, e);
    }
  }

  async findAll(skip = 0, payload: JWTPayload) {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        where: {
          roleId: {
            gt: payload.role.id,
          },
        },
        select: getFull,
      }),
      this.prisma.user.count(),
    ]);

    return {
      count,
      data,
    };
  }

  async findByToken(id: number) {
    return this.prisma.user.findUnique({ where: { id }, select: getFull });
  }

  async clicks(id: number) {
    const [banners, chains, contexts] = await this.prisma.$transaction([
      this.prisma.banner.aggregate({
        where: { userId: id },
        _sum: { clicked: true },
      }),
      this.prisma.chain.aggregate({
        where: { userId: id },
        _sum: { clicked: true },
      }),
      this.prisma.context.aggregate({
        where: { userId: id },
        _sum: { clicked: true },
      }),
    ]);

    return {
      banners: banners._sum.clicked || 0,
      chains: chains._sum.clicked || 0,
      contexts: contexts._sum.clicked || 0,
    };
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id }, select: getFull });
  }

  async update(
    id: number,
    params: UpdateUserDto,
    payload: JWTPayload,
  ): Promise<User> {
    const candidate = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!candidate)
      return ErrorHandler(404, null, `User with id ${id} not found`);

    const data: Prisma.UserUpdateInput = {};

    if (params.email && candidate.email !== params.email) {
      const _candidate = await this.prisma.user.findFirst({
        where: { email: params.email },
      });

      if (_candidate)
        return ErrorHandler(409, null, `${params.email} is already in use`);

      data.email = params.email;
    }

    if (params.phone && candidate.phone !== params.phone) {
      const _candidate = await this.prisma.user.findFirst({
        where: { phone: params.phone },
      });

      if (_candidate)
        return ErrorHandler(409, null, `${params.phone} is already in use`);

      data.phone = params.phone;
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

    if (params.avatarId && candidate.avatarId !== params.avatarId) {
      data.avatar = { connect: { id: params.avatarId } };
    }

    if (params.name?.trim() && candidate.name !== params.name.trim()) {
      data.name = params.name.trim();
    }

    if (
      ![null, undefined].includes(params.balance) &&
      candidate.balance !== params.balance
    ) {
      data.balance = params.balance;
    }

    if (params.password) {
      if (params.oldPassword) {
        const equals = await bcrypt.compare(
          params.oldPassword,
          candidate.password,
        );

        if (!equals)
          return ErrorHandler(400, null, 'Старый пароль введен неверно');

        data.password = await bcrypt.hash(params.password, 12);
      } else {
        const equals = await bcrypt.compare(
          params.password,
          candidate.password,
        );

        if (!equals) data.password = await bcrypt.hash(params.password, 12);
      }
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: candidate.id },
        data,
        select: getFull,
      });

      if (user.avatar?.id && candidate.avatarId !== user.avatar?.id) {
        await this.file.delete({ id: user.avatar.id });
      }

      return user;
    } catch (e) {
      return ErrorHandler(500, null, e);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { deleted: true },
      });

      return { status: 200, message: 'Success' };
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }
}
