import { Injectable } from '@nestjs/common';
import {
  Action,
  BoxScore,
  Period,
  PlayByPlay,
  Player,
  PlayerGameBar,
  PlayerPeriodPerformance,
  PlayerStats,
  Team,
} from './model';

@Injectable()
export class GameBarService {

  calculateStatsForPlayerForPeriod(actions: Action[], player: Player, period: Period): PlayerStats {
    let points = 0;
    let missedShotsAndFreeThrows = 0;
    let assists = 0;
    let turnovers = 0;
    let rebounds = 0;
    let steals = 0;
    let blocks = 0;
    let fouls = 0;
    for (const action of actions) {
      if ((period === undefined || action.period === period.period) && action.personId === player.personId) {
        if (['2pt', '3pt', 'freethrow'].includes(action.actionType) && action.shotResult === 'Made') {
          switch (action.actionType) {
            case '2pt':
              points += 2;
              break;
            case '3pt':
              points += 3;
              break;
            case 'freethrow':
              points += 1;
              break;
          }
        } else if (['2pt', '3pt', 'freethrow'].includes(action.actionType) && action.shotResult === 'Missed') {
          missedShotsAndFreeThrows += 1;
        } else if (action.actionType === "turnover") {
          turnovers += 1;
        } else if (action.actionType === "rebound") {
          rebounds += 1;
        } else if (action.actionType === "foul") {
          fouls += 1;
        }
      } else if ((period === undefined || action.period === period.period) && action.assistPersonId === player.personId) {
        assists += 1;
      } else if ((period === undefined || action.period === period.period) && action.stealPersonId === player.personId) {
        steals += 1;
      } else if ((period === undefined || action.period === period.period) && action.blockPersonId === player.personId) {
        blocks += 1;
      }
    }
    return {
      points: points,
      missedShotsAndFreeThrows: missedShotsAndFreeThrows,
      assists: assists,
      turnovers: turnovers,
      rebounds: rebounds,
      steals: steals,
      blocks: blocks,
      fouls: fouls
    };
  }

  getGameBarsForTeam = (boxScore: BoxScore, playByPlay: PlayByPlay): [Team, Team] => {
    const away = boxScore.awayTeam.players.map(player => this.createPlayerPeriodPerformance(playByPlay, player, boxScore.awayTeam.periods));
    const home = boxScore.homeTeam.players.map(player => this.createPlayerPeriodPerformance(playByPlay, player, boxScore.homeTeam.periods));
    const awayTeam = {...boxScore.awayTeam, playerGameBars: away}
    const homeTeam = {...boxScore.awayTeam, playerGameBars: home}
    return [awayTeam, homeTeam];
  }


  createPlayerPeriodPerformance = (playByPlay: PlayByPlay, player: Player, periods: Period[]): PlayerGameBar => {
    let result: PlayerPeriodPerformance[] = [];
    for (const period of periods) {
      result.push({
        period: period,
        player: player,
        stats: this.calculateStatsForPlayerForPeriod(playByPlay.actions, player, period),
      });
    }
    return {
      player: player,
      playerPeriodPerformance: result
    };
  };

  getPeriods = (boxScore: BoxScore): Period[] => {
    return boxScore.homeTeam.periods;
  };

  getPlayers = (boxScore: BoxScore): Player[] => {
    const homePlayers = boxScore.homeTeam.players;
    const awayPlayers = boxScore.awayTeam.players;
    return homePlayers.concat(awayPlayers);
  };
}
