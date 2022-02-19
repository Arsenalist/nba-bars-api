import { Player } from './model';

export function removeDNPs(player: Player[]): Player[] {
  return player.filter(player => player.played === "1");
}
