import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import R, { Redis } from 'ioredis';

@Injectable()
export class IORedisService implements OnModuleInit {
  private logger = new Logger('IORedisService');
  redis: Redis;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    if (this.config.get('mode') === 'PROD') {
      this.redis = new R(this.config.get('redis'));
      this.logger.log('Redis connected');
    }
  }
}
