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

  add(stats: PlayerStats) {
    this.points += stats.points;
    this.missedShotsAndFreeThrows += stats.missedShotsAndFreeThrows;
    this.assists += stats.assists;
    this.turnovers += stats.turnovers;
    this.rebounds += stats.rebounds;
    this.steals += stats.steals;
    this.blocks += stats.blocks;
    this.fouls += stats.fouls;
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
  awayTeam: Team
}

export interface Action {
  period?: number,
  personId?: number,
  actionType?: string,
  actionNumber?: number,a
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
  description?: string
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
  color: string
}

export class PlayerGraphLineup {
  constructor(data: {}) {
    Object.keys(data).forEach(key=>this[key]=data[key]);
  }
  duration: number;
  inLineup: boolean;
  player: string;
  plusMinus: number;
  lineupStats: PlayerStats;
  actions: Action[] = [];
  formattedDetail: string;
  formattedLabel: string;
}
