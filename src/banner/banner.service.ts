import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorHandler } from 'src/utils';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateBannerDto) {
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

  async findAll(skip = 0) {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.bannerType.findMany({ skip }),
      this.prisma.bannerType.count(),
    ]);

    return {
      count,
      data,
    };
  }

  async update(id: number, params: UpdateBannerDto) {
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
