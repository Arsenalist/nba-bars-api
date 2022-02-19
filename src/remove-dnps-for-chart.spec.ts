import { removeDNPs } from './remove-dnps-for-chart';
import { Player } from './model';

describe('remove DNPs for chart', () => {
  it('remove DNP from box score', () => {
    const players: Player[] = [
      {personId: 1, played: "1"},
      {personId: 2, played: "0"},
      {personId: 3, played: "0"},
    ]
    const result = removeDNPs(players);
    expect(result.length).toBe(1);
    expect(result[0].personId).toBe(1);
  });
});
