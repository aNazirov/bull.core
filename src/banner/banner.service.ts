import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { BannerPosition, Prisma } from '@prisma/client';
import * as moment from 'moment';
import { JWTPayload } from 'src/auth/dto/auth.dto';
import { ErrorHandler } from 'src/utils';
import {
  CreateBannerDto,
  CreateBannerTypeDto,
  UpdateBannerTypeDto,
} from './dto/banner.dto';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateBannerDto, payload: JWTPayload) {
    const [user, type] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: { id: payload.userId },
      }),
      this.prisma.bannerType.findUnique({
        where: { id: params.typeId },
      }),
    ]);

    const needToPay = type.price * params.days;

    if (user.balance < needToPay) {
      return ErrorHandler(400, null, 'Недостаточно средств');
    }

    try {
      const banner = await this.prisma.banner.create({
        data: {
          url: params.url,
          type: { connect: { id: type.id } },
          user: { connect: { id: user.id } },
          poster: { connect: { id: params.posterId } },
          activeAt: new Date(moment().add(params.days).format()),
        },
      });

      this.prisma.user.update({
        where: { id: user.id },
        data: {
          balance: user.balance - needToPay,
        },
      });

      return banner;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async createType(params: CreateBannerTypeDto) {
    const candidate = await this.prisma.bannerType.findUnique({
      where: { name: params.name },
    });

    if (candidate) {
      return ErrorHandler(
        400,
        null,
        `Banner type with name ${params.name} already exist`,
      );
    }

    try {
      const bannerType = await this.prisma.bannerType.create({
        data: {
          name: params.name,
          size: params.size,
          price: params.price,
          index: params.index,
          position: params.position,
        },
      });

      return bannerType;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async findAllTypes(skip = 0) {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.bannerType.findMany({ skip }),
      this.prisma.bannerType.count(),
    ]);

    return {
      count,
      data,
    };
  }

  async findGroupedTypes(skip = 0) {
    const [types, count] = await this.prisma.$transaction([
      this.prisma.bannerType.findMany({ skip, orderBy: { index: 'asc' } }),
      this.prisma.bannerType.count(),
    ]);

    const data = types.reduce(
      (total, type) => {
        if (type.position === BannerPosition.full) {
          total.full.push(type);
          return total;
        }

        if (type.position === BannerPosition.left) {
          total.left.push(type);
          return total;
        }

        if (type.position === BannerPosition.right) {
          total.right.push(type);
          return total;
        }
      },
      {
        full: [],
        left: [],
        right: [],
      },
    );

    return {
      count,
      data,
    };
  }

  async findAll(skip = 0) {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.banner.findMany({ skip }),
      this.prisma.banner.count(),
    ]);

    return {
      count,
      data,
    };
  }

  async update(id: number, params: UpdateBannerTypeDto) {
    const candidate = await this.prisma.bannerType.findUnique({
      where: { id },
    });

    if (!candidate) {
      return ErrorHandler(400, null, `Banner type with id ${id} not found`);
    }

    const data: Prisma.BannerTypeUpdateInput = {};

    if (params.name && candidate.name !== params.name) {
      const conflict = await this.prisma.bannerType.findUnique({
        where: { name: params.name },
      });

      if (conflict) {
        return ErrorHandler(
          400,
          null,
          `Banner type with name ${params.name} already exist`,
        );
      }

      data.name = params.name;
    }

    if (params.size && candidate.size !== params.size) {
      data.size = params.size;
    }

    if (
      ![null, undefined].includes(params.price) &&
      candidate.price !== params.price
    ) {
      data.price = params.price;
    }

    if (
      ![null, undefined].includes(params.index) &&
      candidate.index !== params.index
    ) {
      data.index = params.index;
    }

    if (params.position && candidate.position !== params.position) {
      data.position = params.position;
    }

    try {
      const bannerType = await this.prisma.bannerType.update({
        where: { id: candidate.id },
        data,
      });

      return bannerType;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async remove(id: number) {
    try {
      return this.prisma.bannerType.delete({ where: { id } });
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }
}
