import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JWTPayload } from 'src/auth/dto/auth.dto';
import { JwtAuthGuard, JWTPayloadData } from 'src/common/guards/jwt.guard';
import { BannerService } from './banner.service';
import {
  CreateBannerDto,
  CreateBannerTypeDto,
  UpdateBannerTypeDto,
} from './dto/banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() params: CreateBannerDto,
    @JWTPayloadData() payload: JWTPayload,
  ) {
    return this.bannerService.create(params, payload);
  }

  @Post('type')
  @UseGuards(JwtAuthGuard)
  createType(@Body() params: CreateBannerTypeDto) {
    return this.bannerService.createType(params);
  }

  @Get('type')
  findAllTypes(@Query('skip') skip?: string) {
    return this.bannerService.findAllTypes(+skip);
  }

  @Get('type/grouped')
  findGroupedTypes(@Query('skip') skip?: string) {
    return this.bannerService.findGroupedTypes(+skip);
  }

  @Get()
  findAll(@Query('skip') skip?: string) {
    return this.bannerService.findAll(+skip);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() params: UpdateBannerTypeDto) {
    return this.bannerService.update(+id, params);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}
