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
import { ContextService } from './context.service';
import { CreateContextDto, UpdateContextDto } from './dto/context.dto';

@Controller('context')
export class ContextController {
  constructor(private readonly contextService: ContextService) {}

  @Post()
  create(@Body() params: CreateContextDto) {
    return this.contextService.create(params);
  }

  @Get()
  findAll(@Query('skip') skip?: string) {
    return this.contextService.findAll(+skip);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() params: UpdateContextDto) {
    return this.contextService.update(+id, params);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contextService.remove(+id);
  }
}
