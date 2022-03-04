import { Action, HomeAway, Player, TeamStats } from './model';
import { Clock } from './clock';

export class Lineup {
  constructor(private homeAway: HomeAway) {
  }
  private _players: Player[] = [];
  private _firstAction: Action;
  private _lastAction: Action;
  private _actions: Action[];
  private _teamStats: TeamStats;

  get players(): Player[] {
    return this._players;
  }
  set players(value: Player[]) {
    this._players = value;
  }

  get plusMinus(): number {
    if (this.homeAway == HomeAway.AWAY) {
      const startDifferential = parseInt(this._firstAction.scoreAway) - parseInt(this._firstAction.scoreHome);
      const endDifferential =  parseInt(this._lastAction.scoreAway) - parseInt(this._lastAction.scoreHome);
      return endDifferential - startDifferential;
    } else {
      const startDifferential = parseInt(this._firstAction.scoreHome) - parseInt(this._firstAction.scoreAway);
      const endDifferential =  parseInt(this._lastAction.scoreHome) - parseInt(this._lastAction.scoreAway);
      return endDifferential - startDifferential;
    }
  }

  get firstAction(): Action {
    return this._firstAction;
  }
  set firstAction(value: Action) {
    this._firstAction = value;
  }

  get lastAction(): Action {
    return this._lastAction;
  }
  set lastAction(value: Action) {
    this._lastAction = value;
  }

  get actions(): Action[] {
    return this._actions;
  }
  set actions(value: Action[]) {
    this._actions = value;
  }

  get teamStats(): TeamStats {
    return this._teamStats;
  }
  set teamStats(value: TeamStats) {
    this._teamStats = value;
  }

  get durationInSeconds(): number {
    return new Clock(this.lastAction.clock, this.lastAction.period).elapsedTime() -
    new Clock(this.firstAction.clock, this.firstAction.period).elapsedTime()
  }

  get summary(): string {
    const startClock = `${new Clock(this.firstAction.clock, this.firstAction.period).displayTime()}`;
    const endClock = `${new Clock(this.lastAction.clock, this.lastAction.period).displayTime()}<br>`;
    let text = `${startClock}-${endClock} ${this.plusMinus} +/-<br>`;
    this.players.forEach(p => {
      text += `${p.name}: ${p.lineupStats.points} PTS, ${p.lineupStats.assists} AST, ${p.lineupStats.rebounds} REB<br>`
    });
    return text;
  }
}
