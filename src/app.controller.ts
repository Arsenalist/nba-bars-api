import { Controller, Get, Param } from '@nestjs/common';
import { GameBarService } from './game-bar.service';
import { NbaService } from './nba.service';
import { LineupService } from './lineup.service';
import { HomeAway, Player, PlayerStats } from './model';
import { Lineup } from './lineup';
import { Periods } from './periods';
import * as dayjs from 'dayjs';
import { consolidateMultiplePlayerLineups } from './lineup-for-chart';
import { removeDNPsFromBoxScore, removeDNPSFromLineups } from './remove-dnps-for-chart';
dayjs.extend(require('dayjs/plugin/duration'));

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

    const awayLineup = this.lineupService.getLineups(HomeAway.AWAY, playByPlay, boxScore);
    const homeLineup = this.lineupService.getLineups(HomeAway.HOME, playByPlay, boxScore);
    const graphLineups = this.toLineupJson(awayLineup, homeLineup);

    const periods = new Periods(boxScore.homeTeam.periods.length);
    boxScore.awayTeam.color = this.teamColorCodes(boxScore.awayTeam.teamName)
    boxScore.homeTeam.color = this.teamColorCodes(boxScore.homeTeam.teamName)
    boxScore.homeTeam.players = removeDNPsFromBoxScore(boxScore.homeTeam.players);
    boxScore.awayTeam.players = removeDNPsFromBoxScore(boxScore.awayTeam.players);
    return {
      groupLabels: awayGameBar.periods.map(p => p.period),
      chartLabels: ['PTS vs Misses', 'AST vs TO'],
      boxScore: boxScore,
      lineupIntervals: periods.intervalsInSeconds(),
      lineupIntervalsText: periods.display(),
      awayPlayerLineups: removeDNPSFromLineups(consolidateMultiplePlayerLineups(this.createLineupsForPlayers(boxScore.awayTeam.players, awayLineup))),
      homePlayerLineups: removeDNPSFromLineups(consolidateMultiplePlayerLineups(this.createLineupsForPlayers(boxScore.homeTeam.players, homeLineup))),
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
        trace.labels.push(0);
        trace.summary.push('')
      }
      traces.push(trace);
    }
    return traces;
  }

  private createLineupsForPlayers(players: Player[], lineup: Lineup[]) {
    const traces = [];
    lineup.forEach(l => {
      const trace = [];
      players.forEach(p => {
        const foundPlayer: Player = l.players.find(lp => lp.personId === p.personId);
        trace.push({
          duration: l.durationInSeconds,
          inLineup: foundPlayer !== undefined,
          player: p.name,
          lineupStats: foundPlayer ? foundPlayer.lineupStats : undefined,
        });
      });
      traces.push(trace);
    });
    return traces;
  }

  private teamColorCodes(teamName: string) {
    return {
      'Celtics': '#007a33',
      'Hawks': '#e03a3e',
      'Heat': '#98002e',
      'Nets': '#000000',
      'Bulls': '#ce1141',
      'Suns': '#1d1160',
      'Nuggets': '#0e2240',
      'Warriors': '#1d428a',
      'Pacers': '#fdbb30',
      'Bucks': '#00471b',
      'Pelicans': '#0c2340',
      'Thunder': '#007ac1',
      '76ers': '#006bb6',
      'Kings': '#5a2d81',
      'Raptors': '#ce1141',
      'Cavaliers': '#860038',
      'Lakers': '#552583',
      'Clippers': '#c8102e',
      'Hornets': '#1d1160',
      'Mavericks': '#00538c',
      'Pistons': '#c8102e',
      'Rockets': '#ce1141',
      'Grizzlies': '#5d76a9',
      'Timberwolves': '#0c2340',
      'Knicks': '#f58426',
      'Magic': '#0077c0',
      'Trail Blazers': '#e03a3e',
      'Spurs': '#c4ced4',
      'Jazz': '#002b5c',
      'Wizards': '#002b5c'

    }[teamName];
  }
}
