export interface PlayerStats {
  points?: number,
  missedShotsAndFreeThrows: number,
  assists: number,
  turnovers: number,
  rebounds: number,
  steals: number,
  blocks: number,
  fouls: number
}

export interface Player {
  personId: number
  name: string
}

export interface BoxScore {
  homeTeam: Team,
  awayTeam: Team
}

export interface Action {
  period: number,
  personId: number,
  actionType: string,
  actionNumber: number,
  shotResult: string,
  pointsTotal: number,
  assistPersonId: number,
  stealPersonId: number,
  blockPersonId: number
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
  periods: Period[]
}
