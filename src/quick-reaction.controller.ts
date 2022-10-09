import { Controller, Get, Param, Post } from '@nestjs/common';
import { LatestGameCalculator } from './latest-game-calculator';
import { BoxScore, GameScore, Overview, Player, QuickReactionPlayer, TeamBox, TwoTeams } from './model';
import * as dayjs from 'dayjs';
import { NbaService } from './nba.service';

dayjs.extend(require('dayjs/plugin/duration'));
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));

const teamMap = new Map();
teamMap.set('1610612748', 'mia');
teamMap.set('1610612738', 'bos');
teamMap.set('1610612749', 'mil');
teamMap.set('1610612755', 'phi');
teamMap.set('1610612761', 'tor');
teamMap.set('1610612741', 'chi');
teamMap.set('1610612751', 'bkn');
teamMap.set('1610612737', 'atl');
teamMap.set('1610612739', 'cle');
teamMap.set('1610612766', 'cha');
teamMap.set('1610612752', 'ny');
teamMap.set('1610612764', 'was');
teamMap.set('1610612754', 'ind');
teamMap.set('1610612765', 'det');
teamMap.set('1610612753', 'orl');
teamMap.set('1610612756', 'phx');
teamMap.set('1610612763', 'mem');
teamMap.set('1610612744', 'gs');
teamMap.set('1610612742', 'dal');
teamMap.set('1610612762', 'uta');
teamMap.set('1610612743', 'den');
teamMap.set('1610612750', 'min');
teamMap.set('1610612740', 'no');
teamMap.set('1610612746', 'lac');
teamMap.set('1610612759', 'sa');
teamMap.set('1610612747', 'la');
teamMap.set('1610612758', 'sac');
teamMap.set('1610612757', 'por');
teamMap.set('1610612760', 'okc');
teamMap.set('1610612745', 'hou');

function currentDateInEst() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return dayjs().tz('America/New_York');
}

@Controller()
export class QuickReactionController {
  constructor(private readonly nbaService: NbaService) {}

  @Post('/teams')
  getTeams() {
    return [
      {
        full_name: 'Toronto Raptors',
        id: 'tor',
      },
    ];
  }
  @Get('/nba/box/:teamTricode')
  async getQuickReaction(@Param('teamTricode') teamTricode: string) {
    const schedule = await this.nbaService.getSchedule('raptors');
    const game = new LatestGameCalculator(schedule).getLatestGame(
      currentDateInEst(),
    );
    if (game === null) {
      throw new Error("can't find latest game");
    }
    teamTricode = 'TOR';
    const boxScore: BoxScore = await this.nbaService.getBoxScore(
      game.profile.gameId,
    );
    const score: GameScore = {
      away: {
        score: boxScore.awayTeam.score + '',
      },
      home: {
        score: boxScore.homeTeam.score + '',
      },
    };
    const event: TwoTeams = {
      away_team: {
        id: teamMap.get(boxScore.awayTeam.teamId + ''),
        medium_name: boxScore.awayTeam.teamName,
        logos: {
          w72xh72: `https://cdn.nba.com/logos/nba/${boxScore.awayTeam.teamId}/global/D/logo.svg`,
        },
      },
      home_team: {
        id: teamMap.get(boxScore.homeTeam.teamId + ''),
        medium_name: boxScore.homeTeam.teamName,
        logos: {
          w72xh72: `https://cdn.nba.com/logos/nba/${boxScore.homeTeam.teamId}/global/D/logo.svg`,
        },
      },
    };
    const overview: Overview = {
      event: event,
      score: score,
      share_url: `https://www.nba.com/game/${game.profile.gameId}/box-score`,
    };

    let playerRecords: Player[];
    let alignment = '';
    if (boxScore.homeTeam.teamTricode === teamTricode) {
      playerRecords = boxScore.homeTeam.players;
      alignment = 'home';
    } else if (boxScore.awayTeam.teamTricode === teamTricode) {
      playerRecords = boxScore.awayTeam.players;
      alignment = 'away';
    } else {
      console.log(
        teamTricode,
        boxScore.awayTeam.teamTricode,
        boxScore.homeTeam.teamTricode,
      );
      throw new Error('Could not find teamTricode in box score ');
    }
    const players: QuickReactionPlayer[] = playerRecords.map((p) => {
      return {
        id: p.personId + '',
        alignment: alignment,
        player: {
          assists: p.statistics.assists + '',
          dreb: p.statistics.reboundsDefensive + '',
          blocked_shots: p.statistics.blocks + '',
          player_id: p.personId + '',
          field_goals_attempted: p.statistics.fieldGoalsAttempted + '',
          field_goals_made: p.statistics.fieldGoalsMade + '',
          first_initial_and_last_name: p.nameI,
          free_throws_attempted: p.statistics.freeThrowsAttempted + '',
          free_throws_made: p.statistics.freeThrowsMade + '',
          minutes: p.statistics.minutesCalculated.replace(/\D/g, ''),
          oreb: p.statistics.reboundsOffensive + '',
          steals: p.statistics.steals + '',
          points: p.statistics.points + '',
          plus_minus: p.statistics.plusMinusPoints + '',
          rebounds_total: p.statistics.reboundsTotal + '',
          three_point_field_goals_attempted:
            p.statistics.threePointersAttempted + '',
          three_point_field_goals_made: p.statistics.threePointersMade + '',
          turnovers: p.statistics.turnovers + '',
          position: p.position,
          dnp: p.played,
          starter: p.starter === '1',
          pf: p.statistics.foulsPersonal + '',
          headshots: {
            w192xh192: `https://cdn.nba.com/headshots/nba/latest/1040x760/${p.personId}.png`,
          },
        },
      };
    });
    const teamBox: TeamBox = {
      overview: overview,
      player_records: players,
      manager: {
        image: 'https://i.imgur.com/QkbchIz.jpg',
        name: 'Nick Nurse',
      },
    };
    return teamBox;
  }
}
