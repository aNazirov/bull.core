import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as moment from 'moment';
import { JWTPayload } from 'src/auth/dto/auth.dto';
import { ErrorHandler } from 'src/utils';
import {
  CreateContextDto,
  CreateContextTypeDto,
  UpdateContextTypeDto,
} from './dto/context.dto';

export const getFull = {
  id: true,
  title: true,
  description: true,
  url: true,
};

@Injectable()
export class ContextService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateContextDto, payload: JWTPayload) {
    const [user, type] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: { id: payload.userId },
      }),
      this.prisma.contextType.findUnique({
        where: { id: params.typeId },
      }),
    ]);

    const needToPay = type.price * params.days;

    if (user.balance < needToPay) {
      return ErrorHandler(400, null, 'Недостаточно средств');
    }

    try {
      const chain = await this.prisma.$transaction([
        this.prisma.context.create({
          data: {
            url: params.url,
            title: params.title,
            description: params.description,
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

  async createType(params: CreateContextTypeDto) {
    try {
      const contextType = await this.prisma.contextType.create({
        data: {
          name: params.name,
          price: params.price,
          priority: params.priority,
        },
      });

      return contextType;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async findAllType(skip = 0) {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.contextType.findMany({ skip }),
      this.prisma.contextType.count(),
    ]);

    return {
      count,
      data,
    };
  }

  async findAll() {
    const [urgents, lows] = await this.prisma.$transaction([
      this.prisma.$queryRaw<
        { id: number }[]
      >`SELECT id FROM "Context" WHERE "activeAt" >= NOW() AND "typeId" = (SELECT id FROM "ContextType" WHERE "priority" = 'urgent') ORDER BY random() LIMIT 3`,
      this.prisma.$queryRaw<
        { id: number }[]
      >`SELECT id FROM "Context" WHERE "activeAt" >= NOW() AND "typeId" = (SELECT id FROM "ContextType" WHERE "priority" = 'low') ORDER BY random() LIMIT 10`,
    ]);

    const [data] = await this.prisma.$transaction([
      this.prisma.context.findMany({
        where: { id: { in: [...urgents, ...lows].map((x) => x.id) } },
        orderBy: {
          type: {
            priority: 'asc',
          },
        },
        select: getFull,
      }),
      // this.prisma.context.count(),
    ]);

    return {
      data,
    };
  }

  async clicked(id: number) {
    const candidate = await this.prisma.context.findUnique({
      where: { id },
    });

    if (!candidate) {
      return ErrorHandler(400, null, 'Контекст не найден');
    }

    try {
      const context = await this.prisma.context.update({
        where: { id: candidate.id },
        data: {
          clicked: { increment: 1 },
        },
      });

      return context;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async update(id: number, params: UpdateContextTypeDto) {
    const candidate = await this.prisma.contextType.findUnique({
      where: { id },
    });

    if (!candidate) {
      return ErrorHandler(400, null, `Context type with id ${id} not found`);
    }

    const data: Prisma.ContextTypeUpdateInput = {};

    if (params.name && candidate.name !== params.name) {
      data.name = params.name;
    }
    if (
      ![null, undefined].includes(params.price) &&
      candidate.price !== params.price
    ) {
      data.price = params.price;
    }

    if (params.priority && candidate.priority !== params.priority) {
      data.priority = params.priority;
    }

    try {
      const contextType = await this.prisma.contextType.update({
        where: { id: candidate.id },
        data,
      });

      return contextType;
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }

  async remove(id: number) {
    try {
      return this.prisma.contextType.delete({ where: { id } });
    } catch (e) {
      return ErrorHandler(500, e);
    }
  }
}
