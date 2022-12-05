import { PrismaService } from '@libs/prisma';
import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { ErrorHandler } from 'src/utils';

interface Args {
  files: Express.Multer.File[];
}

@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async fetchFile(name: string) {
    const file = await this.prisma.file.findUnique({ where: { name } });

    if (!file) return ErrorHandler(404, null, 'File not found');

    return new StreamableFile(createReadStream(file.path));
  }

  async uploadFile(file: Express.Multer.File) {
    if (Array.isArray(file)) {
      file = file[0];
    }

    return this.prisma.file.create({
      data: {
        name: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: `${this.config.get('fileServer')}/file/${file.filename}`,
        path: file.path,
      },
    });
  }

  async uploadFiles({ files }: Args) {
    const requests = files.map((x) => {
      return this.prisma.file.create({
        data: {
          name: x.filename,
          originalName: x.originalname,
          size: x.size,
          mimeType: x.mimetype,
          url: `${this.config.get('fileServer')}/file/${x.filename}`,
          path: x.path,
        },
      });
    });

    return this.prisma.$transaction(requests);
  }

  async delete(where: Prisma.FileWhereUniqueInput) {
    const file = await this.prisma.file.delete({ where });

    if (file) {
      await unlink(file.path);
    }

    return {
      status: 200,
      messsage: 'Success',
    };
  }
}
