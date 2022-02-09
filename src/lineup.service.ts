import { Injectable } from '@nestjs/common';
import { Action, BoxScore, PlayByPlay } from './model';
import { Lineup } from './lineup';
@Injectable()

export class LineupService {

  constructor(private playByPlay: PlayByPlay, private boxScore: BoxScore) {
  }

  getAwayLineups(): Lineup[] {
    let lineup = new Lineup();
    lineup.players = this.getAwayStarters();
    lineup.firstAction = this.playByPlay.actions[0];
    const lineups = [lineup];
    let previousSubClock = undefined;
    for (const action of this.playByPlay.actions) {
      if (action.actionType === "substitution" && this.boxScore.awayTeam.teamId === action.teamId) {
        const nextLineup: Lineup = new Lineup();
        nextLineup.players = lineups[lineups.length-1].players;
        if (previousSubClock === undefined || previousSubClock !== action.clock) {
          lineups[lineups.length-1].lastAction = action;
          lineups[lineups.length-1].actions = this.playByPlay.actions.reduce((prev, curr) => {
            if (curr.actionNumber >= lineups[lineups.length-1].firstAction.actionNumber &&
              curr.actionNumber <= lineups[lineups.length-1].lastAction.actionNumber) {
              prev.push(curr);
            }
            return prev;
          }, []);
          nextLineup.firstAction = action;
          lineups.push(nextLineup);
          previousSubClock = action.clock;
        }
        if (action.subType === "out") {
          nextLineup.players = nextLineup.players.filter(p => action.personId !== p.personId);
        } else if (action.subType === "in") {
          nextLineup.players.push(this.getPlayerFromBoxScore(action.personId))
        }
      }
    }
    return lineups;
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
