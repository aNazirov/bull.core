import { PrismaModule } from '@libs/prisma';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { appConfiguration } from 'config/config';
import { AuthModule } from './auth/auth.module';
import { BannerModule } from './banner/banner.module';
import { ChainModule } from './chain/chain.module';
import { ContextModule } from './context/context.module';
import { FileModule } from './file/file.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfiguration] }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    PrismaModule,
    FileModule,
    AuthModule,
    UserModule,
    BannerModule,
    ChainModule,
    ContextModule,
    PaymentModule,
  ],
})
export class AppModule {}
