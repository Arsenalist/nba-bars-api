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

  private calculateOffensiveReboundPercentage(): number {
    const opportunitiesForOffensiveRebounds = (this._teamStats.fga-this._teamStats.fgaMade) + this._teamStats.missedSecondFreeThrow;
    if (opportunitiesForOffensiveRebounds > 0) {
      return this._teamStats.offensiveRebounds / opportunitiesForOffensiveRebounds;
    } else {
      return 0;
    }
  }

  get offensiveReboundPercentage(): string {
    return `${(Math.round(100*this.calculateOffensiveReboundPercentage()))}%`;
  }

  get offensiveReboundAlphaColor() : number {
    const oreb = this.calculateOffensiveReboundPercentage();
    if (oreb <= 0.11) {
      return 0.20;
    } else if (oreb <= 0.23) {
      return 0.55;
    } else if (oreb <= 0.35) {
      return 0.75;
    } else {
      return 1;
    }
  }

  get offensiveReboundPercentageExplained(): string {
    return `OREB: ${this._teamStats.offensiveRebounds}<br>` +
      `Missed FGA: ${this._teamStats.fga - this._teamStats.fgaMade}<br>` +
      `Missed FTs (last ones only): ${this._teamStats.missedSecondFreeThrow}<br>${this.summary}`;
  }

  private calculateDefensiveReboundPercentage(): number {
    const opportunitiesForDefensiveRebounds = (this._teamStats.oppositionFga-this._teamStats.oppositionFgm) + this._teamStats.oppositionMissedSecondFreeThrow;
    if (opportunitiesForDefensiveRebounds > 0) {
      return this._teamStats.defensiveRebounds / opportunitiesForDefensiveRebounds;
    } else {
      return 0;
    }
  }

  get defensiveReboundPercentage(): string {
    return `${(Math.round(100*this.calculateDefensiveReboundPercentage()))}%`;
  }

  get defensiveReboundPercentageExplained(): string {
    return `DREB: ${this._teamStats.defensiveRebounds}<br>` +
      `Opp Missed FGA: ${this._teamStats.oppositionFga - this._teamStats.oppositionFgm}<br>` +
      `Opp Missed FTs (last ones only): ${this._teamStats.oppositionMissedSecondFreeThrow}<br>${this.summary}`;
  }

  get defensiveReboundAlphaColor() : number {
    const dreb = this.calculateDefensiveReboundPercentage();
    if (dreb <= 0.55) {
      return 0.20;
    } else if (dreb <= 0.78) {
      return 0.55;
    } else {
      return 1;
    }
  }
}
