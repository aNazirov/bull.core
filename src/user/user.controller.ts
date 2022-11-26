import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JWTPayload } from 'src/auth/dto/auth.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JWTPayloadData } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Enums } from 'src/utils';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Enums.RoleType.Admin, Enums.RoleType.Moderator, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  create(@Body() params: CreateUserDto, @JWTPayloadData() payload: JWTPayload) {
    return this.userService.create(params, payload);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('token')
  findByToken(@JWTPayloadData() payload: JWTPayload) {
    return this.userService.findByToken(payload.userId);
  }

  @Patch(':id')
  @Roles(Enums.RoleType.Admin)
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
