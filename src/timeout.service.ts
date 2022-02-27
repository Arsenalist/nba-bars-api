import { Action, BoxScore, PlayByPlay, Run, TimeoutAnalysis } from './model';
import { Injectable } from '@nestjs/common';
import { Clock } from './clock';

@Injectable()
export class TimeoutService {

  getTimeoutAnalysis(boxScore: BoxScore, playByPlay: PlayByPlay): TimeoutAnalysis[] {
    const timeoutActions = playByPlay.actions.filter(a => a.actionType === "timeout" || (a.actionType === "period" && a.subType === "start")).map(a => {
      a.clock = new Clock(a.clock, a.period).displayTime();
      return a;
    });
    if (timeoutActions.length !== 0) {
      timeoutActions.splice(0, 1);
    }
    return timeoutActions.map((action, index) => {
      const afterActions = this.getActionsTillNextTimeout(action, playByPlay.actions, timeoutActions, index);
      if (afterActions.length !== 0) {
        return {
          afterRun: new Run(afterActions),
          timeoutAction: action
        }
      }
    }).filter(a => a !== undefined);
  }

  private getActionsTillNextTimeout(action: Action, allActions: Action[], timeoutActions: Action[], currentTimeoutActionIndex: number): Action[] {
    const nextTimeoutAction = timeoutActions[Math.min(currentTimeoutActionIndex+1, timeoutActions.length-1)];
    return allActions.filter(a => a.actionNumber < nextTimeoutAction.actionNumber && a.actionNumber > action.actionNumber);
  }

}
