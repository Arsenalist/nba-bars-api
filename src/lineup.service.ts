import { Injectable } from '@nestjs/common';
import { Action, BoxScore, HomeAway, PlayByPlay, TeamStats } from './model';
import { Lineup } from './lineup';
import { GameBarService } from './game-bar.service';

@Injectable()
export class LineupService {

  constructor(private readonly gameBarService: GameBarService) {
  }

  getLineups(homeAway: HomeAway, playByPlay: PlayByPlay, boxScore: BoxScore): Lineup[] {
    this.sortActionsByTimeActualInPlace(playByPlay);
    let lineup = new Lineup(homeAway);
    lineup.players = homeAway === HomeAway.AWAY ? this.getAwayStarters(boxScore) : this.getHomeStarters(boxScore);
    lineup.firstAction = playByPlay.actions[0];
    let lineups = [lineup];
    let previousActionTypeForTeam = undefined;
    let nextLineup: Lineup;
    playByPlay.actions.forEach((action, index) => {
      const boxScoreTeamToCompareId = homeAway === HomeAway.AWAY ? boxScore.awayTeam.teamId : boxScore.homeTeam.teamId;
      if (action.actionType === 'substitution' && boxScoreTeamToCompareId === action.teamId) {
        if (previousActionTypeForTeam !== 'substitution') {
          nextLineup = new Lineup(homeAway);
          nextLineup.players = lineups[lineups.length - 1].players;
          lineups[lineups.length - 1].lastAction = action;
          lineups[lineups.length - 1].actions = this.getActionsForLineup(lineups[lineups.length - 1], playByPlay.actions);
          nextLineup.firstAction = action;
          lineups.push(nextLineup);
        } else {
          nextLineup = lineups[lineups.length - 1];
        }
        if (action.subType === 'out') {
          nextLineup.players = nextLineup.players.filter(p => action.personId !== p.personId);
        } else if (action.subType === 'in') {
          nextLineup.players.push(this.getPlayerFromBoxScore(action.personId, boxScore));
        }
      }
      if (boxScoreTeamToCompareId === action.teamId) {
        previousActionTypeForTeam = action.actionType;
      }
      // last entry needs to be part of the last lineup
      if (index === playByPlay.actions.length - 1) {
        lineups[lineups.length - 1].lastAction = action;
        lineups[lineups.length - 1].actions = this.getActionsForLineup(lineups[lineups.length - 1], playByPlay.actions);
      }
    });
    const lineupWithStats = this.addLineupSpecificStatsForPlayers(lineups);
    return this.addTeamStatsForLineups(lineupWithStats, homeAway === HomeAway.AWAY ? boxScore.awayTeam.teamId : boxScore.homeTeam.teamId);
  }

  private sortActionsByTimeActualInPlace(playByPlay: PlayByPlay) {
    playByPlay.actions.sort((a, b) => {
      if (a.timeActual > b.timeActual) {
        return 1;
      } else if (b.timeActual > a.timeActual) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  private addLineupSpecificStatsForPlayers(lineups: Lineup[]): Lineup[] {
    return lineups.map(lineup => {
      lineup.players = lineup.players.map(player => {
        return {
          ...player,
          lineupStats: this.gameBarService.calculateStatsForPlayerForPeriod(lineup.actions, player, undefined),
        };
      });
      return lineup;
    });
  }

  private addTeamStatsForLineups(lineups: Lineup[], teamId: number): Lineup[] {
    return lineups.map(lineup => {
      lineup.teamStats = this.calculateTeamStatsForForPeriod(lineup.actions, teamId);
      return lineup;
    });
  }

  private calculateTeamStatsForForPeriod(actions: Action[], teamId: number): TeamStats {
    let fga = 0;
    let fta = 0;
    let turnovers = 0;
    let offensiveRebounds = 0;
    let defensiveRebounds = 0;
    let fgaMade = 0;
    let missedSecondFreeThrow = 0;
    let oppositionMissedSecondFreeThrow = 0;
    let oppositionFgm = 0;
    let oppositionFga = 0;
    for (const action of actions) {
      if (action.teamId === teamId) {
        if (['3pt', '2pt'].includes(action.actionType)) {
          fga++;
          if (action.shotResult === 'Made') {
            fgaMade++;
          }
        } else if (['freethrow'].includes(action.actionType)) {
          fta++;
          if (['2 of 2', '3 of 3'].includes(action.subType) && action.shotResult === 'Missed') {
            missedSecondFreeThrow++;
          }
        } else if (['turnover'].includes(action.actionType)) {
          turnovers++;
        } else if (action.actionType === 'rebound' && action.subType === 'offensive' && (action.qualifiers === undefined || !action.qualifiers.includes('deadball'))) {
          offensiveRebounds++;
        } else if (action.actionType === 'rebound' && action.subType === 'defensive') {
          defensiveRebounds++;
        }
      } else if (action.teamId !== undefined) {
        if (['3pt', '2pt'].includes(action.actionType)) {
          oppositionFga++;
          if (action.shotResult === 'Made') {
            oppositionFgm++;
          }
        } else if ('freethrow' === action.actionType && ['2 of 2', '3 of 3'].includes(action.subType) && action.shotResult === 'Missed') {
          oppositionMissedSecondFreeThrow++;
        }
      }
    }

    return new TeamStats({
      totalOffensivePossessions: fga + turnovers + (.44 * fta),
      fga,
      offensiveRebounds,
      defensiveRebounds,
      fgaMade,
      missedSecondFreeThrow,
      oppositionMissedSecondFreeThrow,
      oppositionFgm,
      oppositionFga
    });
  }

  private getActionsForLineup(lineup: Lineup, actions: Action[]) {
    return actions.reduce((prev, curr) => {
      if (curr.timeActual >= lineup.firstAction.timeActual &&
        curr.timeActual <= lineup.lastAction.timeActual) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }

  getPlayerFromBoxScore(personId: number, boxScore: BoxScore) {
    return boxScore.awayTeam.players.concat(boxScore.homeTeam.players).find(p => p.personId === personId);
  }

  private getAwayStarters(boxScore: BoxScore) {
    return boxScore.awayTeam.players.filter(p => p.starter === '1');
  }

  private getHomeStarters(boxScore: BoxScore) {
    return boxScore.homeTeam.players.filter(p => p.starter === '1');
  }

}
