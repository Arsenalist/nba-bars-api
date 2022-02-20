import { Player, PlayerGraphLineup } from './model';
import { consolidatePlayerLineups } from './lineup-for-chart';

export function removeDNPsFromBoxScore(player: Player[]): Player[] {
  return player.filter(player => player.played === "1");
}

export function removeDNPSFromLineups(lineups: PlayerGraphLineup[][]): any {
  const transposed = lineups[0].map((_, colIndex) => lineups.map(row => row[colIndex]));
  const result = [];
  transposed.forEach((value) => {
    if (hasPlayed(value)) {
      result.push(value);
    }
  });
  return result[0].map((_, colIndex) => result.map(row => row[colIndex]));
}

function hasPlayed(playerLineups) {
  return playerLineups.filter(p => p.inLineup === true).length !== 0;
}
