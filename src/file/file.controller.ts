import {
  Controller,
  Delete,
  Get,
  HostParam,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Enums, multerStorage } from 'src/utils';
import { FileService, IFileMulter } from './file.service';

@Controller('file')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':name')
  getFile(@Param('name') name: string): Promise<StreamableFile> {
    return this.fileService.fetchFile(name);
  }

  @Post('upload')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.Moderator)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage,
    }),
  )
  uploadSingle(@UploadedFile() file: IFileMulter) {
    return this.fileService.uploadFile(file);
  }

  @Post('upload-many')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.Moderator)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: multerStorage,
    }),
  )
  uploadMultiple(@UploadedFiles() files: IFileMulter[], @HostParam() host) {
    return this.fileService.uploadFiles({ files });
  }

  @Delete(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  delete(@Param('id') id: number) {
    return this.fileService.delete({ id: +id });
  }
}
