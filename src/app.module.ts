import { MeiliModule } from '@libs/meili';
import { PrismaModule } from '@libs/prisma';
import { IORedisModule } from '@libs/redis';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as RedisStore from 'cache-manager-redis-store';
import { appConfiguration } from 'config/config';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfiguration] }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: RedisStore,
      host: appConfiguration().redis.host,
      port: appConfiguration().redis.port,
    }),
    PrismaModule,
    IORedisModule,
    MeiliModule,
    FileModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
