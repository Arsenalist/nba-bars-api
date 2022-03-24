import { Action, HomeAway } from './model';
import * as dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/customParseFormat'))


export class ScoreDifference {
  constructor(obj: {}) {
    Object.keys(obj).forEach(key=>this[key]=obj[key]);
    if (this.durationInSeconds !== undefined) {
      this.setRunDurationDisplay(this.durationInSeconds);
    }
  }
  startClockDisplay: string;
  endClockDisplay: string;
  runDurationDisplay: string
  startAction: Action;
  endAction: Action;
  durationInSeconds: number;
  difference: number;
  winner: HomeAway | undefined

  isOverlappingWith(sd: ScoreDifference): boolean {
    return !(this.startAction.actionNumber > sd.endAction.actionNumber || this.endAction.actionNumber < sd.startAction.actionNumber);
  }

  private setRunDurationDisplay(durationInSeconds: number) {
    const start = dayjs().startOf('year')
    const then = start.add(this.durationInSeconds, 's');
    this.runDurationDisplay = then.format('m:ss');
  }
}
