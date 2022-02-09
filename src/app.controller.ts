import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { GameBarService } from './game-bar.service';
import { NbaService } from './nba.service';

@Controller()
export class AppController {
  constructor(private readonly nbaService: NbaService, private readonly gameBarService: GameBarService) {}

  @Get('/bars/:gameId')
  async getGameBars(@Param('gameId') gameId: number) {
    const boxScore = await this.nbaService.getBoxScore(gameId);
    const playByPlay = await this.nbaService.getPlayByPlay(gameId);
    const [awayGameBar, homeGameBar] =  this.gameBarService.getGameBarsForTeam(boxScore, playByPlay);

    return {
      groupLabels: awayGameBar.periods.map(p => p.period),
      chartLabels: ['PTS vs Misses', 'AST vs TO'],
      boxScore: boxScore,
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

}
