import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [FileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
