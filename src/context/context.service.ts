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
      const chain = await this.prisma.context.create({
        data: {
          url: params.url,
          title: params.title,
          description: params.description,
          type: { connect: { id: type.id } },
          user: { connect: { id: user.id } },
          activeAt: new Date(moment().add(params.days).format()),
        },
      });

      this.prisma.user.update({
        where: { id: user.id },
        data: {
          balance: user.balance - needToPay,
        },
      });

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

  async findAll(skip = 0) {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.context.findMany({ skip }),
      this.prisma.context.count(),
    ]);

    return {
      count,
      data,
    };
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
