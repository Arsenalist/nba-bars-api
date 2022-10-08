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
import { AppService } from './app-service';
import { GameCacheService } from './db/game-cache.service';
import { ScoringRunService } from './scoring-run.service';
import { TheScoreService } from './the-score.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [TheScoreService, ScoringRunService, GameCacheService, AppService, GameBarService, NbaService, LineupService, DifferentialService, AssistDistributionService, ShotDistanceService, PointsQualifierService, TimeoutService],
})
export class AppModule {}
