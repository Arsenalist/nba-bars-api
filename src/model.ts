import { Clock } from './clock';

export class TeamStats {
  constructor(stats: {}) {
    Object.keys(stats).forEach(key=>this[key]=stats[key]);
  }
  totalOffensivePossessions: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  fga: number;
  fgaMade: number;
  missedSecondFreeThrow: number;
  oppositionMissedSecondFreeThrow: number;
  oppositionFgm: number;
  oppositionFga: number;
  offensivePossessions: number;
  defensivePossessions: number;
  pointsScored: number;
  oppositionPointsScored: number;

  add(stats: TeamStats) {
    this.totalOffensivePossessions += stats.totalOffensivePossessions;
    this.offensiveRebounds += stats.offensiveRebounds;
    this.defensiveRebounds += stats.defensiveRebounds;
    this.fga += stats.fga;
    this.fgaMade += stats.fgaMade;
    this.missedSecondFreeThrow += stats.missedSecondFreeThrow;
    this.oppositionMissedSecondFreeThrow += stats.oppositionMissedSecondFreeThrow;
    this.oppositionFgm += stats.oppositionFgm;
    this.oppositionFga += stats.oppositionFga;
    this.offensivePossessions += stats.offensivePossessions;
    this.defensivePossessions += stats.defensivePossessions;
    this.pointsScored += stats.pointsScored;
    this.oppositionPointsScored += stats.oppositionPointsScored;
  }
}

export class PlayerStats {

  constructor(stats: {}) {
    Object.keys(stats).forEach(key=>this[key]=stats[key]);
  }

  points: number;
  missedShotsAndFreeThrows: number;
  assists: number;
  turnovers: number;
  rebounds: number;
  steals: number;
  blocks: number;
  fouls: number;
  fta: number;
  fga2: number;
  fga3: number;

  add(stats: PlayerStats) {
    this.points += stats.points;
    this.missedShotsAndFreeThrows += stats.missedShotsAndFreeThrows;
    this.assists += stats.assists;
    this.turnovers += stats.turnovers;
    this.rebounds += stats.rebounds;
    this.steals += stats.steals;
    this.blocks += stats.blocks;
    this.fouls += stats.fouls;
    this.fta += stats.fta;
    this.fga2 += stats.fga2;
    this.fga3 += stats.fga3;
  }

  toHtml(): string {
    return [
      `${this.points} PTS`,
      `${this.rebounds} REB`,
      `${this.assists} AST`,
      `${this.turnovers} TO`,
      `${this.steals} STL`,
      `${this.blocks} BLK`
    ].join(", ")
  }
}


export enum HomeAway {
  HOME = 0,
  AWAY = 1
}

export interface Player {
  personId: number
  played?: string
  name?: string,
  starter?: string,
  lineupStats?: PlayerStats
}

export interface BoxScore {
  homeTeam: Team,
  awayTeam: Team,
  gameStatusText: string
}

export interface Action {
  period?: number,
  personId?: number,
  actionType?: string,
  actionNumber?: number,
  shotResult?: string,
  pointsTotal?: number,
  assistPersonId?: number,
  stealPersonId?: number,
  blockPersonId?: number,
  teamId?: number,
  scoreHome?: string,
  scoreAway?: string,
  clock?: string,
  subType?: string,
  description?: string,
  shotDistance?: number,
  teamTricode?: string,
  playerNameI?: string,
  qualifiers?: string[],
  timeActual?: string
}

export interface PlayByPlay {
  actions: Action[]
}

export interface Period {
  period: number,
  periodType: string,
  score?: number
}

export interface PlayerPeriodPerformance {
  period: Period,
  player: Player,
  stats: PlayerStats,
}

export interface PlayerGameBar {
  player: Player,
  playerPeriodPerformance: PlayerPeriodPerformance[]
}

export interface Team {
  teamId: number,
  teamName: string,
  playerGameBars: PlayerGameBar[]
  players: Player[],
  periods: Period[],
  color: string,
  teamTricode: string
}

export class PlayerGraphLineup {
  constructor(data: {}) {
    Object.keys(data).forEach(key=>this[key]=data[key]);
  }
  duration: number;
  inLineup: boolean;
  player?: string;
  plusMinus?: number;
  lineupStats: PlayerStats;
  actions?: Action[] = [];
  plusMinusDetail?: string;
  plusMinusLabel?: string;
  teamStats?: TeamStats
}

export class Shot {
  constructor(action: Action) {
    this.action = action;
    const clock = new Clock(action.clock, action.period)
    this.gameClockInSeconds = clock.elapsedTime();
    this.displayTime = clock.displayTime()
  }
  action: Action;
  gameClockInSeconds: number;
  displayTime: string;
}

export class Run {
  constructor(actions: Action[]) {
    this.actions = actions;
    this.setScores();
  }
  private setScores() {
    const awayScoreBegin = parseInt(this.actions[0].scoreAway);
    const awayScoreEnd = parseInt(this.actions[this.actions.length-1].scoreAway);
    const homeScoreBegin = parseInt(this.actions[0].scoreHome);
    const homeScoreEnd = parseInt(this.actions[this.actions.length-1].scoreHome);
    this.awayScore = awayScoreEnd - awayScoreBegin;
    this.homeScore = homeScoreEnd - homeScoreBegin;
  }
  awayScore: number
  homeScore: number
  actions: Action[];

}

export interface TimeoutAnalysis {
  timeoutAction: Action;
  afterRun: Run;
}

