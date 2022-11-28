import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorHandler } from 'src/utils';
import { CreateChainDto, UpdateChainDto } from './dto/chain.dto';

@Injectable()
export class ChainService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateChainDto) {
    try {
      const chainType = await this.prisma.chainType.create({
        data: {
          price: params.price,
          active: params.active,
        },
      });

      return chainType;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async findAll(skip = 0) {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.chainType.findMany({ skip }),
      this.prisma.chainType.count(),
    ]);

    return {
      count,
      data,
    };
  }

  async update(id: number, params: UpdateChainDto) {
    const candidate = await this.prisma.chainType.findUnique({
      where: { id },
    });

    if (!candidate) {
      return ErrorHandler(400, null, `Chain type with id ${id} not found`);
    }

    const data: Prisma.ChainTypeUpdateInput = {};

    if (
      ![null, undefined].includes(params.price) &&
      candidate.price !== params.price
    ) {
      data.price = params.price;
    }

    if (
      ![null, undefined].includes(params.active) &&
      candidate.active !== params.active
    ) {
      data.active = params.active;
    }

    try {
      const chainType = await this.prisma.chainType.update({
        where: { id: candidate.id },
        data,
      });

      if (data.active) {
        await this.prisma.chainType.updateMany({
          where: {
            id: { not: chainType.id },
          },
          data: {
            active: false,
          },
        });
      }

      return chainType;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async remove(id: number) {
    try {
      return this.prisma.chainType.delete({ where: { id } });
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }
}
