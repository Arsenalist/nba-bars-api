import { Injectable } from '@nestjs/common';
import { BoxScore, HomeAway, PlayByPlay, Shot } from './model';

@Injectable()
export class ShotDistanceService {


  getTeamShotDistances(homeAway: HomeAway, boxScore: BoxScore, playByPlay: PlayByPlay): Shot[] {
    const teamTricode = homeAway === HomeAway.AWAY ? boxScore.awayTeam.teamTricode : boxScore.homeTeam.teamTricode;
    return playByPlay.actions.filter(a => (a.teamTricode === teamTricode && ['2pt', '3pt'].includes(a.actionType)))
      .map(a => new Shot(a));
  }
}
