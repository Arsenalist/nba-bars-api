import { Clock } from './clock';
import { Action } from './model';

export class Differential {
  constructor(action: Action) {
    this.elapsedTimeInSeconds = this.getElapsedTimeInSeconds(action.clock, action.period);
    this.awayMinusHomeDifference = this.getAwayMinusHomeDifference(action.scoreAway, action.scoreHome);
    this.summary = this.createSummary(action);
  }
  elapsedTimeInSeconds: number;
  awayMinusHomeDifference: number;
  summary: string;

  private createSummary(action: Action) {
    return `${new Clock(action.clock, action.period).displayTime()}: ${action.scoreAway}-${action.scoreHome}, (${Math.abs(this.awayMinusHomeDifference)})`;
  }

  private getAwayMinusHomeDifference(scoreAway: string, scoreHome: string): number {
    return parseInt(scoreAway) - parseInt(scoreHome);
  }

  private getElapsedTimeInSeconds(clock: string, period: number): number {
    return new Clock(clock, period).elapsedTime();
  }
}
