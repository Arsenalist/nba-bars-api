import { removeDNPsFromBoxScore, removeDNPSFromLineups } from './remove-dnps-for-chart';
import { Player, PlayerGraphLineup, PlayerStats, TeamStats } from './model';

function p(duration, inLineup): PlayerGraphLineup {
  return {duration: duration, inLineup: inLineup, lineupStats: new PlayerStats({
      assists: 0,
      blocks: 0,
      fouls: 0,
      missedShotsAndFreeThrows: 0,
      rebounds: 0,
      steals: 0,
      turnovers: 0
    }), teamStats: new TeamStats({})};
}
describe('remove DNPs for chart', () => {
  it('remove DNP from box score', () => {
    const players: Player[] = [
      {personId: 1, played: "1"},
      {personId: 2, played: "0"},
      {personId: 3, played: "0"},
    ]
    const result = removeDNPsFromBoxScore(players);
    expect(result.length).toBe(1);
    expect(result[0].personId).toBe(1);
  });
  it('remove DNPs from chart traces (where all lineups have the player as inLineup === false', () => {
    const lineups = [
      [p(8, true), p(8, false)],
      [p(4, true), p(2, false)],
      [p(1, true), p(3, false)],
      [p(8, false), p(4, false)]
    ];
    const result = removeDNPSFromLineups(lineups);
    expect(result.length).toBe(4);
    expect(result[0].length).toBe(1);
    expect(result[1].length).toBe(1);
    expect(result[1][0].duration).toBe(4);
    expect(result[2].length).toBe(1);
    expect(result[3].length).toBe(1);
  });
});
