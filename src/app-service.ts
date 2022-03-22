import { Injectable, OnModuleInit } from '@nestjs/common';
import { createRedisClient } from './db/resdis-connection';

@Injectable()
export class AppService implements OnModuleInit {
  async onModuleInit() {
    console.log(`AppService Initialization...`);
    await createRedisClient();
  }
}
