import { Controller, Get, Param, Post } from '@nestjs/common';
import { GameBarService } from './game-bar.service';
import { NbaService } from './nba.service';
import { LineupService } from './lineup.service';
import {
  BoxScore,
  GameScore,
  HomeAway,
  Overview,
  Player,
  PlayerGraphLineup,
  QuickReactionPlayer,
  TeamBox,
  TeamStats,
  TwoTeams,
} from './model';
import { Lineup } from './lineup';
import { Periods } from './periods';
import * as dayjs from 'dayjs';
import { consolidateMultiplePlayerLineups } from './lineup-for-chart';
import {
  removeDNPsFromBoxScore,
  removeDNPSFromLineups,
} from './remove-dnps-for-chart';
import { unloadAndFormat } from './unload-and-format';
import { DifferentialService } from './differential.service';
import { AssistDistributionService } from './assist-distribution.service';
import { ShotDistanceService } from './shot-distance.service';
import { PointsQualifierService } from './points-qualifier-service';
import { TimeoutService } from './timeout.service';
import { GameCacheService } from './db/game-cache.service';
import { ScoringRunService } from './scoring-run.service';

dayjs.extend(require('dayjs/plugin/duration'));

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


@Controller()
export class AppController {
  constructor(
    private readonly nbaService: NbaService,
    private readonly gameCacheService: GameCacheService,
    private readonly gameBarService: GameBarService,
    private readonly lineupService: LineupService,
    private readonly differentialService: DifferentialService,
    private readonly assistDistributionService: AssistDistributionService,
    private readonly shotDistanceService: ShotDistanceService,
    private readonly pointsQualifierService: PointsQualifierService,
    private readonly timeoutService: TimeoutService,
    private readonly scoringRunService: ScoringRunService,
  ) {}

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
    // const schedule = await this.nbaService.getSchedule('raptors');
    console.log("1")
    const gameId = 0012200020; // schedule['monthGroups'][0]['games'][0]['profile']['gameId'];

    teamTricode = 'TOR';
    const boxScore: BoxScore = await this.nbaService.getBoxScore(gameId);
    console.log("2")
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
      share_url: '',
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
          three_point_field_goals_attempted: '',
          three_point_field_goals_made: '',
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

  @Get('/bars/:gameId')
  async getGameBars(@Param('gameId') gameId: number) {
    const gameData = await this.gameCacheService.getGameData(gameId);
    if (gameData) {
      return JSON.parse(gameData);
    }
    const boxScore = await this.nbaService.getBoxScore(gameId);
    const playByPlay = await this.nbaService.getPlayByPlay(gameId);
    const [awayGameBar, homeGameBar] = this.gameBarService.getGameBarsForTeam(
      boxScore,
      playByPlay,
    );

    const awayLineup = this.lineupService.getLineups(
      HomeAway.AWAY,
      playByPlay,
      boxScore,
    );
    const homeLineup = this.lineupService.getLineups(
      HomeAway.HOME,
      playByPlay,
      boxScore,
    );
    const graphLineups = this.toLineupJson(awayLineup, homeLineup);

    const periods = new Periods(boxScore.homeTeam.periods.length);
    boxScore.awayTeam.color = this.teamColorCodes(boxScore.awayTeam.teamName);
    boxScore.homeTeam.color = this.teamColorCodes(boxScore.homeTeam.teamName);
    boxScore.homeTeam.players = removeDNPsFromBoxScore(
      boxScore.homeTeam.players,
    );
    boxScore.awayTeam.players = removeDNPsFromBoxScore(
      boxScore.awayTeam.players,
    );
    const returnValue = {
      scoringRuns: this.scoringRunService.getScoringRuns(playByPlay),
      groupLabels: awayGameBar.periods.map((p) => p.period),
      chartLabels: ['PTS vs Misses', 'AST vs TO'],
      boxScore: boxScore,
      differential: this.differentialService.createDifferential(playByPlay),
      lineupIntervals: periods.intervalsInSeconds(),
      lineupIntervalsText: periods.display(),
      awayPlayerLineups: unloadAndFormat(
        removeDNPSFromLineups(
          consolidateMultiplePlayerLineups(
            this.createLineupsForPlayers(boxScore.awayTeam.players, awayLineup),
          ),
        ),
      ),
      homePlayerLineups: unloadAndFormat(
        removeDNPSFromLineups(
          consolidateMultiplePlayerLineups(
            this.createLineupsForPlayers(boxScore.homeTeam.players, homeLineup),
          ),
        ),
      ),
      lineups: graphLineups,
      timeoutAnalysis: this.timeoutService.getTimeoutAnalysis(
        boxScore,
        playByPlay,
      ),
      awayTeam: {
        players: this.getPlayersFromGameBar(awayGameBar),
        assistDistribution:
          this.assistDistributionService.getAssistDistribution(
            boxScore.awayTeam.players,
            playByPlay,
          ),
        shotDistance: this.shotDistanceService.getTeamShotDistances(
          HomeAway.AWAY,
          boxScore,
          playByPlay,
        ),
        pointsFastBreak: this.pointsQualifierService.getFastBreakPointsByPeriod(
          HomeAway.AWAY,
          boxScore,
          playByPlay,
        ),
        pointsFromTurnovers:
          this.pointsQualifierService.getPointsScoredOffTurnovers(
            HomeAway.AWAY,
            boxScore,
            playByPlay,
          ),
        pointsInThePaint:
          this.pointsQualifierService.getPointsInThePaintByPeriod(
            HomeAway.AWAY,
            boxScore,
            playByPlay,
          ),
      },
      homeTeam: {
        players: this.getPlayersFromGameBar(homeGameBar),
        assistDistribution:
          this.assistDistributionService.getAssistDistribution(
            boxScore.homeTeam.players,
            playByPlay,
          ),
        shotDistance: this.shotDistanceService.getTeamShotDistances(
          HomeAway.HOME,
          boxScore,
          playByPlay,
        ),
        pointsFastBreak: this.pointsQualifierService.getFastBreakPointsByPeriod(
          HomeAway.HOME,
          boxScore,
          playByPlay,
        ),
        pointsFromTurnovers:
          this.pointsQualifierService.getPointsScoredOffTurnovers(
            HomeAway.HOME,
            boxScore,
            playByPlay,
          ),
        pointsInThePaint:
          this.pointsQualifierService.getPointsInThePaintByPeriod(
            HomeAway.HOME,
            boxScore,
            playByPlay,
          ),
      },
    };
    if (boxScore.gameStatusText === 'Final') {
      this.gameCacheService.setGameData(gameId, returnValue);
    }
    return returnValue;
  }

  @Get('/games/:date')
  async getGames(@Param('date') date: string) {
    return this.nbaService.getGames(date);
  }

  getPlayersFromGameBar(gameBar) {
    const players = [];
    for (const pgb of gameBar.playerGameBars) {
      const positiveValues1 = pgb.playerPeriodPerformance.map(
        (ppp) => ppp.stats.points,
      );
      const negativeValues1 = pgb.playerPeriodPerformance.map(
        (ppp) => ppp.stats.missedShotsAndFreeThrows,
      );
      const positiveValues2 = pgb.playerPeriodPerformance.map(
        (ppp) => ppp.stats.assists,
      );
      const negativeValues2 = pgb.playerPeriodPerformance.map(
        (ppp) => ppp.stats.turnovers,
      );
      if (pgb.player.played === '1') {
        players.push({
          positiveValues: [positiveValues1, positiveValues2],
          negativeValues: [negativeValues1, negativeValues2],
          positiveLabels: ['PTS', 'Assists'],
          negativeLabels: ['Misses', 'TO'],
          player: pgb.player,
        });
      }
    }
    return players;
  }

  private toLineupJson(awayLineup: Lineup[], homeLineup: Lineup[]) {
    const traces = [];
    for (let i = 0; i < Math.max(awayLineup.length, homeLineup.length); i++) {
      const trace = {
        values: [],
        labels: [],
        summary: [],
        offensiveReboundPercentage: [],
        offensiveReboundPercentageExplained: [],
        offensiveReboundAlphaColor: [],
        defensiveReboundPercentage: [],
        defensiveReboundPercentageExplained: [],
        defensiveReboundAlphaColor: [],
        ortg: [],
        ortgAlphaColor: [],
        drtg: [],
        drtgAlphaColor: [],
        ortgExplained: [],
        drtgExplained: [],
      };
      if (i < awayLineup.length) {
        trace.values.push(awayLineup[i].durationInSeconds);
        trace.labels.push(awayLineup[i].plusMinus);
        trace.summary.push(awayLineup[i].summary);
        trace.offensiveReboundPercentage.push(
          awayLineup[i].offensiveReboundPercentage,
        );
        trace.offensiveReboundPercentageExplained.push(
          awayLineup[i].offensiveReboundPercentageExplained,
        );
        trace.offensiveReboundAlphaColor.push(
          awayLineup[i].offensiveReboundAlphaColor,
        );
        trace.defensiveReboundPercentage.push(
          awayLineup[i].defensiveReboundPercentage,
        );
        trace.defensiveReboundPercentageExplained.push(
          awayLineup[i].defensiveReboundPercentageExplained,
        );
        trace.defensiveReboundAlphaColor.push(
          awayLineup[i].defensiveReboundAlphaColor,
        );
        trace.ortg.push(awayLineup[i].ortg);
        trace.ortgAlphaColor.push(awayLineup[i].ortgAlphaColor);
        trace.drtg.push(awayLineup[i].drtg);
        trace.drtgAlphaColor.push(awayLineup[i].drtgAlphaColor);
        trace.ortgExplained.push(awayLineup[i].ortgExplained);
        trace.drtgExplained.push(awayLineup[i].drtgExplained);
      } else {
        trace.labels.push(0);
        trace.values.push(0);
        trace.summary.push('');
        trace.offensiveReboundPercentage.push('');
        trace.offensiveReboundPercentageExplained.push('');
        trace.offensiveReboundAlphaColor.push('');
        trace.defensiveReboundPercentage.push('');
        trace.defensiveReboundPercentageExplained.push('');
        trace.defensiveReboundAlphaColor.push('');
        trace.ortg.push('');
        trace.ortgAlphaColor.push('');
        trace.drtg.push('');
        trace.drtgAlphaColor.push('');
        trace.ortgExplained.push('');
        trace.drtgExplained.push('');
      }
      if (i < homeLineup.length) {
        trace.values.push(homeLineup[i].durationInSeconds);
        trace.labels.push(homeLineup[i].plusMinus);
        trace.summary.push(homeLineup[i].summary);
        trace.offensiveReboundPercentage.push(
          homeLineup[i].offensiveReboundPercentage,
        );
        trace.offensiveReboundPercentageExplained.push(
          homeLineup[i].offensiveReboundPercentageExplained,
        );
        trace.offensiveReboundAlphaColor.push(
          homeLineup[i].offensiveReboundAlphaColor,
        );
        trace.defensiveReboundPercentage.push(
          homeLineup[i].defensiveReboundPercentage,
        );
        trace.defensiveReboundPercentageExplained.push(
          homeLineup[i].defensiveReboundPercentageExplained,
        );
        trace.defensiveReboundAlphaColor.push(
          homeLineup[i].defensiveReboundAlphaColor,
        );
        trace.ortg.push(homeLineup[i].ortg);
        trace.ortgAlphaColor.push(homeLineup[i].ortgAlphaColor);
        trace.drtg.push(homeLineup[i].drtg);
        trace.drtgAlphaColor.push(homeLineup[i].drtgAlphaColor);
        trace.ortgExplained.push(homeLineup[i].ortgExplained);
        trace.drtgExplained.push(homeLineup[i].drtgExplained);
      } else {
        trace.values.push(0);
        trace.labels.push(0);
        trace.summary.push('');
        trace.offensiveReboundPercentage.push('');
        trace.offensiveReboundPercentageExplained.push('');
        trace.offensiveReboundAlphaColor.push('');
        trace.defensiveReboundPercentage.push('');
        trace.defensiveReboundPercentageExplained.push('');
        trace.defensiveReboundAlphaColor.push('');
        trace.ortg.push('');
        trace.ortgAlphaColor.push('');
        trace.drtg.push('');
        trace.drtgAlphaColor.push('');
        trace.ortgExplained.push('');
        trace.drtgExplained.push('');
      }
      traces.push(trace);
    }
    return traces;
  }

  private createLineupsForPlayers(players: Player[], lineup: Lineup[]) {
    const traces = [];
    lineup.forEach((l) => {
      const trace = [];
      players.forEach((p) => {
        const foundPlayer: Player = l.players.find(
          (lp) => lp.personId === p.personId,
        );
        trace.push(
          new PlayerGraphLineup({
            duration: l.durationInSeconds,
            plusMinus: l.plusMinus,
            inLineup: foundPlayer !== undefined,
            player: p.name,
            teamStats: foundPlayer ? new TeamStats(l.teamStats) : undefined,
            lineupStats: foundPlayer ? foundPlayer.lineupStats : undefined,
            actions: foundPlayer
              ? l.actions.filter((a) => a.personId === p.personId)
              : [],
          }),
        );
      });
      traces.push(trace);
    });
    return traces;
  }

  private teamColorCodes(teamName: string) {
    return {
      Celtics: '#007a33',
      Hawks: '#e03a3e',
      Heat: '#98002e',
      Nets: '#000000',
      Bulls: '#ce1141',
      Suns: '#1d1160',
      Nuggets: '#0e2240',
      Warriors: '#1d428a',
      Pacers: '#fdbb30',
      Bucks: '#00471b',
      Pelicans: '#0c2340',
      Thunder: '#007ac1',
      '76ers': '#006bb6',
      Kings: '#5a2d81',
      Raptors: '#ce1141',
      Cavaliers: '#860038',
      Lakers: '#552583',
      Clippers: '#c8102e',
      Hornets: '#1d1160',
      Mavericks: '#00538c',
      Pistons: '#c8102e',
      Rockets: '#ce1141',
      Grizzlies: '#5d76a9',
      Timberwolves: '#0c2340',
      Knicks: '#f58426',
      Magic: '#0077c0',
      'Trail Blazers': '#e03a3e',
      Spurs: '#c4ced4',
      Jazz: '#002b5c',
      Wizards: '#002b5c',
    }[teamName];
  }
}
