import { Injectable } from '@nestjs/common';
import { PlayByPlay, Player } from './model';
import { AssistDistribution, AssistScorers } from './assist-distribution';

@Injectable()
export class AssistDistributionService {

  getAssistDistribution(players: Player[], playByPlay: PlayByPlay): AssistDistribution[] {
    return players.map(player => {
      const map = new Map();
      playByPlay.actions.filter(action => action.assistPersonId === player.personId).forEach(action => {
        if (map.has(action.personId)) {
          map.get(action.personId).push(action);
        } else {
          map.set(action.personId, [action]);
        }
      });
      const result: AssistScorers[] = [];
      map.forEach((value, key) => {
        result.push({
          player: this.findPlayer(players, key),
          numberOfAssists: value.length,
          actions: value
        });
      });
      return {
        player: player,
        assistScorers: result
      }
    });
  }

  private findPlayer(players: Player[], personId: number) {
    return players.find(p => p.personId === personId);
  }
}
