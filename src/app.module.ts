import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GameBarService } from './game-bar.service';
import { NbaService } from './nba.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [GameBarService, NbaService],
})
export class AppModule {}
