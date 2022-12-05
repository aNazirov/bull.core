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
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard, JWTPayloadData } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Enums } from 'src/utils';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  chainService: any;
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  create(@Body() params: CreateUserDto, @JWTPayloadData() payload: JWTPayload) {
    return this.userService.create(params, payload);
  }

  @Get()
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  findAll(@JWTPayloadData() payload: JWTPayload, @Query('skip') skip?: string) {
    return this.userService.findAll(+skip || 0, payload);
  }

  @Get('token')
  findByToken(@JWTPayloadData() payload: JWTPayload) {
    return this.userService.findByToken(payload.userId);
  }

  @Get('clicks')
  clicks(@JWTPayloadData() payload: JWTPayload) {
    return this.userService.clicks(payload.userId);
  }

  @Get(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() params: UpdateUserDto,
    @JWTPayloadData() payload: JWTPayload,
  ) {
    return this.userService.update(+id, params, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
