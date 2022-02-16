import { consolidateMultiplePlayerLineups, consolidatePlayerLineups } from './lineup-for-chart';

function p(duration, inLineup) {
  return {duration: duration, inLineup: inLineup, lineupStats: duration};
}
describe('Lineup for chart', () => {
  it ('consolidates a single player\'s lineup', () => {
    const playerLineups = [
      p(8, true),
      p(6, true),
      p(4, false),
      p(10, false),
      p(5, true),
      p(3, true),
      p(2, false),
      p(6, true),
      p(4, true),
    ];
    const result = consolidatePlayerLineups(playerLineups);
    expect(result[0].duration).toBe(14);
    expect(result[0].inLineup).toBe(true)
    expect(result[1].duration).toBe(0);
    expect(result[1].inLineup).toBe(false);
    expect(result[2].duration).toBe(4);
    expect(result[2].inLineup).toBe(false)
    expect(result[3].duration).toBe(10);
    expect(result[3].inLineup).toBe(false)
    expect(result[4].duration).toBe(5);
    expect(result[4].inLineup).toBe(true);
    expect(result[5].duration).toBe(3);
    expect(result[5].inLineup).toBe(false);
    expect(result[6].duration).toBe(2);
    expect(result[6].inLineup).toBe(false);
    expect(result[7].duration).toBe(6);
    expect(result[7].inLineup).toBe(true);
    expect(result[8].duration).toBe(4);
    expect(result[8].inLineup).toBe(false);


/*    expect(result[0].lineupStats).toBe(14);
    expect(result[1].lineupStats).toBe(14);
    expect(result[2].lineupStats).toBe(4);
    expect(result[3].lineupStats).toBe(10);
    expect(result[4].lineupStats).toBe(8);
    expect(result[5].lineupStats).toBe(8);
    expect(result[6].lineupStats).toBe(2);
    expect(result[7].lineupStats).toBe(10);
    expect(result[8].lineupStats).toBe(10);*/
  });
  it ('consolidates when player is not in last lineup', () => {
    const playerLineups = [
      p(8, true), p(4, true), p(6, false)
    ]
    const result = consolidatePlayerLineups(playerLineups);
    expect(result[0].duration).toBe(12);
    expect(result[0].inLineup).toBe(true)
    expect(result[1].duration).toBe(0);
    expect(result[1].inLineup).toBe(false);
    expect(result[2].duration).toBe(6);
    expect(result[2].inLineup).toBe(false)


  });
  it ('consolidates when only last lineup is unplayed', () => {
    const playerLineups = [
      p(8, true), p(4, true), p(1, true), p(8, false)
    ]
    const result = consolidatePlayerLineups(playerLineups);
    expect(result[0].duration).toBe(13);
    expect(result[0].inLineup).toBe(true)
    expect(result[1].duration).toBe(0);
    expect(result[1].inLineup).toBe(false);
    expect(result[2].duration).toBe(0);
    expect(result[2].inLineup).toBe(false)
    expect(result[3].duration).toBe(8);
    expect(result[3].inLineup).toBe(false)
  });
  it ('consolidate multiple player lineups (2-d matrix)', () => {
    // create some lineups
    const lineups = [
      [p(8, true), p(8, true)],
      [p(4, true), p(2, false)],
      [p(1, true), p(3, true)],
      [p(8, false), p(4, false)]
    ];
    const result = consolidateMultiplePlayerLineups(lineups);
    expect(result[0][0].duration).toBe(13);
    expect(result[0][0].inLineup).toBe(true)
    expect(result[1][0].duration).toBe(0);
    expect(result[1][0].inLineup).toBe(false);
    expect(result[2][0].duration).toBe(0);
    expect(result[2][0].inLineup).toBe(false);
    expect(result[3][0].duration).toBe(8);
    expect(result[3][0].inLineup).toBe(false);

    expect(result[0][1].duration).toBe(8);
    expect(result[0][1].inLineup).toBe(true)
    expect(result[1][1].duration).toBe(2);
    expect(result[1][1].inLineup).toBe(false);
    expect(result[2][1].duration).toBe(3);
    expect(result[2][1].inLineup).toBe(true);
    expect(result[3][1].duration).toBe(4);
    expect(result[3][1].inLineup).toBe(false);

    /*

    expect(result[0][1].duration).toBe(14);
    expect(result[0][1].inLineup).toBe(true)
    expect(result[1][1].duration).toBe(0);
    expect(result[1][1].inLineup).toBe(false);

    expect(result[9][0].duration).toBe(10);
    expect(result[9][0].inLineup).toBe(true);
    expect(result[9][0].duration).toBe(0);
    expect(result[9][0].inLineup).toBe(false);
    expect(result[9][1].duration).toBe(10);
    expect(result[9][1].inLineup).toBe(true);
    expect(result[9][1].duration).toBe(0);
    expect(result[9][1].inLineup).toBe(false);
*/

  })
});
