import { Injectable } from '@nestjs/common';
import { Action, HomeAway, PlayByPlay} from './model';
import { Clock } from './clock';
import { ScoreDifference } from './score-difference';

@Injectable()
export class ScoringRunService {

  getScoringRuns(playByPlay: PlayByPlay): { awayScoringRuns: ScoreDifference[]; homeScoringRuns: ScoreDifference[] } {
    const actions = playByPlay.actions.filter(action => action.shotResult === "Made");
    const scoringMoments = this.createScoringMoments(actions)
    const matrix = this.createScoringDifferencesMatrix(scoringMoments);
    const allRuns = matrix.flat();
    let filteredRuns = allRuns.filter(sd => sd.durationInSeconds < 60*15);

    filteredRuns.sort((a, b) => {
      if (a.difference > b.difference) {
        return -1;
      } else if (a.difference < b.difference) {
        return 1;
      } else {
        return 0;
      }
    });

    filteredRuns = this.removeOverlappingRuns(filteredRuns, [])

    const homeScoringRuns = filteredRuns.filter(sd => sd.winner === HomeAway.HOME).splice(0, 5).map(sr => {
      const startClock = new Clock(sr.startAction.clock, sr.startAction.period);
      sr.startAction.clock = startClock.displayTime();
      const endClock = new Clock(sr.endAction.clock, sr.endAction.period);
      sr.endAction.clock = endClock.displayTime();
      return sr;
    });
    const awayScoringRuns = filteredRuns.filter(sd => sd.winner === HomeAway.AWAY).splice(0, 5).map(sr => {
      const startClock = new Clock(sr.startAction.clock, sr.startAction.period);
      sr.startAction.clock = startClock.displayTime();
      const endClock = new Clock(sr.endAction.clock, sr.endAction.period);
      sr.endAction.clock = endClock.displayTime();
      return sr;
    });
    return {awayScoringRuns, homeScoringRuns}
  }

  private createScoringDifferencesMatrix(scoringDifferences: ScoreMoment[]): ScoreDifference[][] {
    const scoringTracker2d: ScoreDifference[][] = [];
    scoringDifferences.forEach((i, idx1) => {
      const array: ScoreDifference[] = [];
      scoringDifferences.forEach((j, idx2) => {
        if (idx2 >= idx1) {
          array.push(new ScoreDifference({
            startAction: i.action,
            endAction: j.action,
            difference: Math.abs(j.difference - i.difference),
            winner: this.findWinner(j.difference - i.difference),
            durationInSeconds: this.calculateDurationInSeconds(i.action, j.action),
          }));
        }
      });
      if (array.length > 0) {
        scoringTracker2d.push(array);
      }
    });
    return scoringTracker2d;
  }

  private createScoringMoments(actions: Action[]): ScoreMoment[] {
    return actions.map(action => {return {action: action, difference: parseInt(action.scoreAway) - parseInt(action.scoreHome)}});
  }

  private findWinner(difference: number): HomeAway | undefined {
    if (difference > 0) {
      return HomeAway.AWAY;
    } else if (difference < 0) {
      return HomeAway.HOME;
    } else {
      return undefined
    }
  }


  private calculateDurationInSeconds(startAction: Action, endAction: Action): number {
    const startTime = new Clock(startAction.clock, startAction.period).elapsedTime();
    const endTime = new Clock(endAction.clock, endAction.period).elapsedTime();
    return endTime-startTime;

  }

  private removeOverlappingRuns(filteredRuns: ScoreDifference[], result: ScoreDifference[]) {
    if (filteredRuns.length === 0) {
      return result;
    } else if (filteredRuns.length === 1) {
      result.push(filteredRuns[0]);
      return result;
    } else if (filteredRuns.length > 1) {
      const run = filteredRuns[0];
      // remove all overlapping runs in filteredRuns[1...end] which ovelap with run
      const nonoverlap = [];
      for (let i=1; i<filteredRuns.length; i++) {
        if (!run.isOverlappingWith(filteredRuns[i])) {
          nonoverlap.push(filteredRuns[i]);
        }
      }
      result.push(run);
      return this.removeOverlappingRuns(nonoverlap, result);
    }
  }
}

interface ScoreMoment {
  action: Action;
  difference: number;
}

