import { Controller, Get, Param } from '@nestjs/common';
import { GameBarService } from './game-bar.service';
import { NbaService } from './nba.service';
import { LineupService } from './lineup.service';
import { HomeAway } from './model';
import { Lineup } from './lineup';
import { Periods } from './periods';

@Controller()
export class AppController {
  constructor(private readonly nbaService: NbaService,
              private readonly gameBarService: GameBarService,
              private readonly lineupService: LineupService) {}

  @Get('/bars/:gameId')
  async getGameBars(@Param('gameId') gameId: number) {
    const boxScore = await this.nbaService.getBoxScore(gameId);
    const playByPlay = await this.nbaService.getPlayByPlay(gameId);
    const [awayGameBar, homeGameBar] =  this.gameBarService.getGameBarsForTeam(boxScore, playByPlay);

    const graphLineups = this.toLineupJson(this.lineupService.getLineups(HomeAway.AWAY, playByPlay, boxScore),
        this.lineupService.getLineups(HomeAway.HOME, playByPlay, boxScore));

    const periods = new Periods(boxScore.homeTeam.periods.length);
    return {
      groupLabels: awayGameBar.periods.map(p => p.period),
      chartLabels: ['PTS vs Misses', 'AST vs TO'],
      boxScore: boxScore,
      lineupIntervals: periods.intervalsInSeconds(),
      lineupIntervalsText: periods.display(),
      lineups: graphLineups,
      awayTeam: {
        players: this.getPlayersFromGameBar(awayGameBar)
      },
      homeTeam: {
        players: this.getPlayersFromGameBar(homeGameBar)
      }
    };
  }

  @Get('/games/:date')
  async getGames(@Param('date') date: string) {
    return this.nbaService.getGames(date);
  }



  getPlayersFromGameBar(gameBar) {
    const players = []
    for (const pgb of gameBar.playerGameBars) {
      const positiveValues1 = pgb.playerPeriodPerformance.map(ppp => ppp.stats.points);
      const negativeValues1 = pgb.playerPeriodPerformance.map(ppp => ppp.stats.missedShotsAndFreeThrows);
      const positiveValues2 = pgb.playerPeriodPerformance.map(ppp => ppp.stats.assists);
      const negativeValues2 = pgb.playerPeriodPerformance.map(ppp => ppp.stats.turnovers);
      players.push({
        positiveValues: [positiveValues1, positiveValues2],
        negativeValues: [negativeValues1, negativeValues2],
        positiveLabels: ["PTS", "Assists"],
        negativeLabels: ["Misses", "TO"],
        player: pgb.player,
      })
    }
    return players;
  }

  private toLineupJson(awayLineup: Lineup[], homeLineup: Lineup[]) {
    const traces = [];
    for (let i=0; i<Math.max(awayLineup.length, homeLineup.length); i++) {
      const trace = {values: [], labels: [], summary: []};
      if (i < awayLineup.length) {
        trace.values.push(awayLineup[i].durationInSeconds);
        trace.labels.push(awayLineup[i].plusMinus)
        trace.summary.push(awayLineup[i].summary)
      } else {
        trace.labels.push(0);
        trace.values.push(0);
        trace.summary.push('')
      }
      if (i < homeLineup.length) {
        trace.values.push(homeLineup[i].durationInSeconds);
        trace.labels.push(homeLineup[i].plusMinus)
        trace.summary.push(homeLineup[i].summary)
      } else {
        trace.values.push(0);
        trace.values.push(0);
        trace.summary.push('')
      }
      traces.push(trace);
    }
    return traces;
  }
}
