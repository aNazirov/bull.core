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
import { ContextService } from './context.service';
import {
  CreateContextDto,
  CreateContextTypeDto,
  UpdateContextTypeDto,
} from './dto/context.dto';

@Controller('context')
export class ContextController {
  constructor(private readonly contextService: ContextService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() params: CreateContextDto,
    @JWTPayloadData() payload: JWTPayload,
  ) {
    return this.contextService.create(params, payload);
  }

  @Post('type')
  @UseGuards(JwtAuthGuard)
  createType(@Body() params: CreateContextTypeDto) {
    return this.contextService.createType(params);
  }

  @Get('type')
  findAllType(@Query('skip') skip?: string) {
    return this.contextService.findAllType(+skip);
  }

  @Get()
  findAll(@Query('skip') skip?: string) {
    return this.contextService.findAll(+skip);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() params: UpdateContextTypeDto) {
    return this.contextService.update(+id, params);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.contextService.remove(+id);
  }
}
