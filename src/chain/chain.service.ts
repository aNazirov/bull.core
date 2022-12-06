import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as moment from 'moment';
import { JWTPayload } from 'src/auth/dto/auth.dto';
import { ErrorHandler } from 'src/utils';
import {
  CreateChainDto,
  CreateChainTypeDto,
  UpdateChainTypeDto,
} from './dto/chain.dto';

export const getFull = {
  id: true,
  title: true,
  url: true,
};

@Injectable()
export class ChainService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateChainDto, payload: JWTPayload) {
    const [user, type] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: { id: payload.userId },
      }),
      this.prisma.chainType.findFirst({
        where: { active: true },
      }),
    ]);

    const needToPay = type.price * params.days;

    if (user.balance < needToPay) {
      return ErrorHandler(400, null, 'Недостаточно средств');
    }

    try {
      const [chain] = await this.prisma.$transaction([
        this.prisma.chain.create({
          data: {
            url: params.url,
            title: params.title,
            type: { connect: { id: type.id } },
            user: { connect: { id: user.id } },
            activeAt: new Date(moment().add(params.days, 'days').format()),
          },
          select: getFull,
        }),
        this.prisma.user.update({
          where: { id: user.id },
          data: {
            balance: {
              decrement: needToPay,
            },
          },
        }),
      ]);

      return chain;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async createType(params: CreateChainTypeDto) {
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

  async findAllType(skip = 0) {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.chainType.findMany({ skip }),
      this.prisma.chainType.count(),
    ]);

    return {
      count,
      data,
    };
  }

  async findActiveType() {
    const data = await this.prisma.chainType.findMany({
      where: { active: true },
    });

    return {
      data,
    };
  }

  async findAll() {
    const ids = await this.prisma.$queryRaw<
      { id: number }[]
    >`SELECT id FROM "Chain" ORDER BY random() LIMIT 8`;

    const [data] = await this.prisma.$transaction([
      this.prisma.chain.findMany({
        where: { id: { in: ids.map((x) => x.id) } },
        select: getFull,
      }),
      // this.prisma.chain.count(),
    ]);

    return {
      data,
    };
  }

  async clicked(id: number) {
    const candidate = await this.prisma.chain.findUnique({
      where: { id },
    });

    if (!candidate) {
      return ErrorHandler(400, null, 'Цепочка не найдена');
    }

    try {
      const chain = await this.prisma.chain.update({
        where: { id: candidate.id },
        data: {
          clicked: { increment: 1 },
        },
        select: getFull,
      });

      return chain;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async update(id: number, params: UpdateChainTypeDto) {
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

      if (chainType.active) {
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
