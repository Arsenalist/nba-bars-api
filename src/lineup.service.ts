import { Injectable } from '@nestjs/common';
import { BoxScore, HomeAway, PlayByPlay } from './model';
import { Lineup } from './lineup';
import { GameBarService } from './game-bar.service';

@Injectable()
export class LineupService {

  constructor(private readonly gameBarService: GameBarService) {}

  getLineups(homeAway: HomeAway, playByPlay: PlayByPlay, boxScore: BoxScore): Lineup[] {
    let lineup = new Lineup(homeAway);
    lineup.players = homeAway === HomeAway.AWAY ? this.getAwayStarters(boxScore) : this.getHomeStarters(boxScore);
    lineup.firstAction = playByPlay.actions[0];
    let lineups = [lineup];
    let previousActionTypeForTeam = undefined;
    let nextLineup: Lineup;
    playByPlay.actions.forEach( (action, index) =>  {
      const boxScoreTeamToCompareId = homeAway === HomeAway.AWAY ? boxScore.awayTeam.teamId : boxScore.homeTeam.teamId;
      if (action.actionType === "substitution" && boxScoreTeamToCompareId === action.teamId) {
        if (previousActionTypeForTeam !== "substitution") {
          nextLineup = new Lineup(homeAway);
          nextLineup.players = lineups[lineups.length-1].players;
          lineups[lineups.length-1].lastAction = action;
          lineups[lineups.length-1].actions = this.getActionsForLineup(lineups[lineups.length-1], playByPlay);
          nextLineup.firstAction = action;
          lineups.push(nextLineup);
        } else {
          nextLineup = lineups[lineups.length-1];
        }
        if (action.subType === "out") {
          nextLineup.players = nextLineup.players.filter(p => action.personId !== p.personId);
        } else if (action.subType === "in") {
          nextLineup.players.push(this.getPlayerFromBoxScore(action.personId, boxScore));
        }
      }
      if (boxScoreTeamToCompareId === action.teamId) {
        previousActionTypeForTeam = action.actionType;
      }
      // last entry needs to be part of the last lineup
      if (index === playByPlay.actions.length - 1) {
        lineups[lineups.length - 1].lastAction = action;
        lineups[lineups.length-1].actions = this.getActionsForLineup(lineups[lineups.length-1], playByPlay);
      }
    });
    return this.addLineupSpecificStatsForPlayers(lineups);
  }

  private addLineupSpecificStatsForPlayers(lineups: Lineup[]) {
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

  private getActionsForLineup(lineup: Lineup, playByPlay: PlayByPlay) {
    return playByPlay.actions.reduce((prev, curr) => {
      if (curr.actionNumber >= lineup.firstAction.actionNumber &&
        curr.actionNumber <= lineup.lastAction.actionNumber) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }

  getPlayerFromBoxScore(personId: number, boxScore: BoxScore) {
    return boxScore.awayTeam.players.concat(boxScore.homeTeam.players).find(p => p.personId === personId);
  }

  private getAwayStarters(boxScore: BoxScore) {
    return boxScore.awayTeam.players.filter(p => p.starter === "1");
  }

  private getHomeStarters(boxScore: BoxScore) {
    return boxScore.homeTeam.players.filter(p => p.starter === "1");
  }

}
