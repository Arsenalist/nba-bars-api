import { Injectable } from '@nestjs/common';
import { Action, BoxScore, HomeAway, PlayByPlay } from './model';

@Injectable()
export class PointsQualifierService {


  getFastBreakPointsByPeriod(homeAway: HomeAway, boxScore: BoxScore, playByPlay: PlayByPlay) {
    const teamTricode = homeAway === HomeAway.AWAY ? boxScore.awayTeam.teamTricode : boxScore.homeTeam.teamTricode;
    return this.getPointsPerPeriodByQualifier(boxScore.awayTeam.periods.length, playByPlay.actions, teamTricode, "fastbreak");
  }

  getPointsScoredOffTurnovers(homeAway: HomeAway, boxScore: BoxScore, playByPlay: PlayByPlay) {
    const teamTricode = homeAway === HomeAway.AWAY ? boxScore.homeTeam.teamTricode : boxScore.awayTeam.teamTricode;
    return this.getPointsPerPeriodByQualifier(boxScore.awayTeam.periods.length, playByPlay.actions, teamTricode, "fromturnover");
  }

  getPointsInThePaintByPeriod(homeAway: HomeAway, boxScore: BoxScore, playByPlay: PlayByPlay) {
    const teamTricode = homeAway === HomeAway.AWAY ? boxScore.awayTeam.teamTricode : boxScore.homeTeam.teamTricode;
    return this.getPointsPerPeriodByQualifier(boxScore.awayTeam.periods.length, playByPlay.actions, teamTricode, "pointsinthepaint");
  }

  private getPointsPerPeriodByQualifier(numPeriods: number, actions: Action[], teamTricode: string, qualifier: string) {
    const result = [];
    for (let i = 0; i < numPeriods; i++) {
      result.push(0);
    }
    actions.filter(a => (a.teamTricode === teamTricode && a.shotResult === "Made" && a.qualifiers && a.qualifiers.includes(qualifier))).forEach(a => {
      console.log(a.actionNumber)
      result[a.period - 1] += this.getPointsFromAction(a);
    });
    return result;
  }

  private getPointsFromAction(a: Action): number {
    if (a.actionType === "2pt") {
      return 2;
    } else if (a.actionType === "3pt") {
      return 3;
    } else if (a.actionType === "freethrow") {
      return 1;
    } else {
      return 0;
    }
  }

}
