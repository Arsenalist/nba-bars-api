import { PlayerGraphLineup, PlayerStats, TeamStats } from './model';
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
    teamStats: new TeamStats({}),
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
    expect(result[0][0].plusMinusDetail.includes("8 PTS, 3 REB, 2 AST, 1 TO, 2 STL, 1 BLK")).toBe(true)
  })
});
