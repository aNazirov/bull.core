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
import { ChainService } from './chain.service';
import { CreateChainDto, UpdateChainDto } from './dto/chain.dto';

@Controller('chain')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Post()
  create(@Body() params: CreateChainDto) {
    return this.chainService.create(params);
  }

  @Get()
  findAll(@Query('skip') skip?: string) {
    return this.chainService.findAll(+skip);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() params: UpdateChainDto) {
    return this.chainService.update(+id, params);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chainService.remove(+id);
  }
}
