import { Injectable } from '@nestjs/common';
import { BoxScore, HomeAway, PlayByPlay } from './model';
import { Lineup } from './lineup';

@Injectable()

export class LineupService {

  constructor(private playByPlay: PlayByPlay, private boxScore: BoxScore) {
  }

  getLineups(homeAway: HomeAway): Lineup[] {
    let lineup = new Lineup(homeAway);
    lineup.players = homeAway === HomeAway.AWAY ? this.getAwayStarters() : this.getHomeStarters();
    lineup.firstAction = this.playByPlay.actions[0];
    const lineups = [lineup];
    let previousActionTypeForTeam = undefined;
    let nextLineup: Lineup;
    this.playByPlay.actions.forEach( (action, index) =>  {
      const boxScoreTeamToCompareId = homeAway === HomeAway.AWAY ? this.boxScore.awayTeam.teamId : this.boxScore.homeTeam.teamId;
      if (action.actionType === "substitution" && boxScoreTeamToCompareId === action.teamId) {
        if (previousActionTypeForTeam !== "substitution") {
          nextLineup = new Lineup(homeAway);
          nextLineup.players = lineups[lineups.length-1].players;
          lineups[lineups.length-1].lastAction = action;
          lineups[lineups.length-1].actions = this.getActionsForLineup(lineups[lineups.length-1]);
          nextLineup.firstAction = action;
          lineups.push(nextLineup);
        } else {
          nextLineup = lineups[lineups.length-1];
        }
        if (action.subType === "out") {
          nextLineup.players = nextLineup.players.filter(p => action.personId !== p.personId);
        } else if (action.subType === "in") {
          nextLineup.players.push(this.getPlayerFromBoxScore(action.personId))
        }
      }
      if (boxScoreTeamToCompareId === action.teamId) {
        previousActionTypeForTeam = action.actionType;
      }
      // last entry needs to be part of the last lineup
      if (index === this.playByPlay.actions.length - 1) {
        lineups[lineups.length - 1].lastAction = action;
        lineups[lineups.length-1].actions = this.getActionsForLineup(lineups[lineups.length-1]);
      }
    });
    return lineups;
  }

  private getActionsForLineup(lineup: Lineup) {
    return this.playByPlay.actions.reduce((prev, curr) => {
      if (curr.actionNumber >= lineup.firstAction.actionNumber &&
        curr.actionNumber <= lineup.lastAction.actionNumber) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }

  getPlayerFromBoxScore(personId: number) {
    return this.boxScore.awayTeam.players.concat(this.boxScore.homeTeam.players).find(p => p.personId === personId);
  }

  getAwayStarters() {
    return this.boxScore.awayTeam.players.filter(p => p.starter === "1");
  }

  getHomeStarters() {
    return this.boxScore.homeTeam.players.filter(p => p.starter === "1");
  }

}
