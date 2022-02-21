import { Action, Player } from './model';

export interface AssistDistribution {
  player: Player;
  assistScorers: AssistScorers[]
}

export interface AssistScorers {
  player: Player;
  numberOfAssists: number;
  actions: Action[]
}
