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
import { ChainService } from './chain.service';
import {
  CreateChainDto,
  CreateChainTypeDto,
  UpdateChainTypeDto,
} from './dto/chain.dto';

@Controller('chain')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() params: CreateChainDto,
    @JWTPayloadData() payload: JWTPayload,
  ) {
    return this.chainService.create(params, payload);
  }

  @Post('type')
  @UseGuards(JwtAuthGuard)
  createType(@Body() params: CreateChainTypeDto) {
    return this.chainService.createType(params);
  }

  @Get('type')
  findAllType(@Query('skip') skip?: string) {
    return this.chainService.findAllType(+skip);
  }

  @Get('type/active')
  findActiveType() {
    return this.chainService.findActiveType();
  }

  @Get()
  findAll(@Query('skip') skip?: string) {
    return this.chainService.findAll(+skip);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() params: UpdateChainTypeDto) {
    return this.chainService.update(+id, params);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.chainService.remove(+id);
  }
}
