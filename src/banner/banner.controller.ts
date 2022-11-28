import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  create(@Body() params: CreateBannerDto) {
    return this.bannerService.create(params);
  }

  @Get()
  findAll(@Query('skip') skip?: string) {
    return this.bannerService.findAll(+skip);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() params: UpdateBannerDto) {
    return this.bannerService.update(+id, params);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}
