import { consolidateMultiplePlayerLineups } from './lineup-for-chart';
import { PlayerGraphLineup, PlayerStats } from './model';
import { unloadAndFormat } from './unload-and-format';

function createPgl(): PlayerGraphLineup {
  return new PlayerGraphLineup({lineupStats: new PlayerStats({
      assists: 2,
      blocks: 1,
      fouls: 1,
      missedShotsAndFreeThrows: 5,
      rebounds: 3,
      steals: 2,
      turnovers: 1,
      points: 8
    }),
    actions: [
      {actionType: 'assist'},
      {actionType: 'assist'},
      {actionType: 'block'},
      {actionType: 'turnover'},
      {actionType: 'rebound'},
      {actionType: 'rebound'},
      {actionType: 'rebound'},
      {actionType: 'steal'},
      {actionType: 'steal'},
      {actionType: 'turnover'},
      {actionType: '2pt'},
      {actionType: '3pt'},
      {actionType: '3pt'},
    ]
  });
}

describe('unload and format', () => {
  it ('format details and label', () => {
    // create some lineups
    const pgl = createPgl();
    const pgls =  [
      [pgl],
      [pgl],
    ];
    const result = unloadAndFormat(pgls);
    expect(result[0][0].formattedDetail).toEqual("assist")
  })
});
