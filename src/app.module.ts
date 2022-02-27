import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GameBarService } from './game-bar.service';
import { NbaService } from './nba.service';
import { HttpModule } from '@nestjs/axios';
import { LineupService } from './lineup.service';
import { DifferentialService } from './differential.service';
import { AssistDistributionService } from './assist-distribution.service';
import { ShotDistanceService } from './shot-distance.service';
import { PointsQualifierService } from './points-qualifier-service';
import { TimeoutService } from './timeout.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [GameBarService, NbaService, LineupService, DifferentialService, AssistDistributionService, ShotDistanceService, PointsQualifierService, TimeoutService],
})
export class AppModule {}
