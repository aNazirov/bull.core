import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorHandler } from 'src/utils';
import { CreateContextDto, UpdateContextDto } from './dto/context.dto';

@Injectable()
export class ContextService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateContextDto) {
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

  async findAll(skip = 0) {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.contextType.findMany({ skip }),
      this.prisma.contextType.count(),
    ]);

    return {
      count,
      data,
    };
  }

  async update(id: number, params: UpdateContextDto) {
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
