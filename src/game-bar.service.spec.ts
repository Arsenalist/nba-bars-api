import { GameBarService } from './game-bar.service';

const fs = require('fs');

import { BoxScore, PlayByPlay, PlayerGameBar, PlayerPeriodPerformance } from './model';

function pointsTotal(playerGameBar: PlayerGameBar, personId: number) {
  return playerGameBar.playerPeriodPerformance.filter(ppp => ppp.player.personId === personId).reduce((prev, curr) => curr.stats.points + prev, 0);
}

function quarterPointsTotal(playerGameBar: PlayerGameBar, personId: number, period: number) {
  return playerGameBar.playerPeriodPerformance.filter(ppp => ppp.player.personId === personId && ppp.period.period === period).reduce((prev, curr) => curr.stats.points + prev, 0);
}

function quarterMissedShotsAndFreeThrowsTotal(playerGameBar: PlayerGameBar, personId: number, period: number) {
  return playerGameBar.playerPeriodPerformance.filter(ppp => ppp.player.personId === personId && ppp.period.period === period).reduce((prev, curr) => curr.stats.missedShotsAndFreeThrows + prev, 0);
}

function quarterAssistsTotal(playerGameBar: PlayerGameBar, personId: number, period: number) {
  return playerGameBar.playerPeriodPerformance.filter(ppp => ppp.player.personId === personId && ppp.period.period === period).reduce((prev, curr) => curr.stats.assists + prev, 0);
}

function quarterTurnoversTotal(playerGameBar: PlayerGameBar, personId: number, period: number) {
  return playerGameBar.playerPeriodPerformance.filter(ppp => ppp.player.personId === personId && ppp.period.period === period).reduce((prev, curr) => curr.stats.turnovers + prev, 0);
}

function quarterReboundsTotal(playerGameBar: PlayerGameBar, personId: number, period: number) {
  return playerGameBar.playerPeriodPerformance.filter(ppp => ppp.player.personId === personId && ppp.period.period === period).reduce((prev, curr) => curr.stats.rebounds + prev, 0);
}

function quarterStealsTotal(playerGameBar: PlayerGameBar, personId: number, period: number) {
  return playerGameBar.playerPeriodPerformance.filter(ppp => ppp.player.personId === personId && ppp.period.period === period).reduce((prev, curr) => curr.stats.steals + prev, 0);
}

function quarterBlocksTotal(playerGameBar: PlayerGameBar, personId: number, period: number) {
  return playerGameBar.playerPeriodPerformance.filter(ppp => ppp.player.personId === personId && ppp.period.period === period).reduce((prev, curr) => curr.stats.blocks + prev, 0);
}

function quarterFoulsTotal(playerGameBar: PlayerGameBar, personId: number, period: number) {
  return playerGameBar.playerPeriodPerformance.filter(ppp => ppp.player.personId === personId && ppp.period.period === period).reduce((prev, curr) => curr.stats.fouls + prev, 0);
}

describe('GameBarService', () => {
  let nbaService: GameBarService;
  beforeEach(async () => {
    nbaService = new GameBarService();
  });


  it('gets players from box score', () => {
    let boxScore: BoxScore = JSON.parse(fs.readFileSync(`./testdata/boxscore-tormia.json`)).game;
    const players = nbaService.getPlayers(boxScore);
    expect(players[0].name).toBe('Jimmy Butler');
    expect(players[0].personId).toBe(202710);
  });
  it('gets periods from box score', () => {
    let boxScore: BoxScore = JSON.parse(fs.readFileSync(`./testdata/boxscore-tormia.json`)).game;
    const periods = nbaService.getPeriods(boxScore);
    expect(periods.length).toBe(7);
    expect(periods[0].period).toBe(1);
    expect(periods[6].period).toBe(7);
    expect(periods[6].periodType).toBe('OVERTIME');
  });
  describe('GameBarService', () => {
    let nbaService: GameBarService;
    let boxScore: BoxScore;
    let playByPlay: PlayByPlay;
    beforeEach(async () => {
      nbaService = new GameBarService();
      boxScore = JSON.parse(fs.readFileSync(`./testdata/boxscore-tormia.json`)).game;
      playByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-tormia.json`)).game;
    });

    it('calculates distribution of player points by period and total', () => {
      // jimmy butler
      const jimmy = boxScore.homeTeam.players.find(p => p.personId === 202710);
      let result = nbaService.createPlayerPeriodPerformance(playByPlay, jimmy, boxScore.homeTeam.periods);
      expect(pointsTotal(result, 202710)).toBe(37);
      expect(quarterPointsTotal(result, 202710, 1)).toBe(11);
      expect(quarterPointsTotal(result, 202710, 2)).toBe(13);
      expect(quarterPointsTotal(result, 202710, 3)).toBe(5);
      expect(quarterPointsTotal(result, 202710, 4)).toBe(4);
      expect(quarterPointsTotal(result, 202710, 5)).toBe(2);
      expect(quarterPointsTotal(result, 202710, 6)).toBe(2);
      expect(quarterPointsTotal(result, 202710, 7)).toBe(0);

      // pj tucker
      const pj = boxScore.homeTeam.players.find(p => p.personId === 200782);
      result = nbaService.createPlayerPeriodPerformance(playByPlay, pj, boxScore.homeTeam.periods);
      expect(pointsTotal(result, 200782)).toBe(11);

    });
    it('calculates missed shots and free throws totals', () => {
      const jimmy = boxScore.homeTeam.players.find(p => p.personId === 202710);
      let result = nbaService.createPlayerPeriodPerformance(playByPlay, jimmy, boxScore.homeTeam.periods);

      expect(quarterMissedShotsAndFreeThrowsTotal(result, 202710, 1)).toBe(2);
      expect(quarterMissedShotsAndFreeThrowsTotal(result, 202710, 2)).toBe(3); // bug on NBA.com which doesn't count FGs
      expect(quarterMissedShotsAndFreeThrowsTotal(result, 202710, 3)).toBe(3);
      expect(quarterMissedShotsAndFreeThrowsTotal(result, 202710, 4)).toBe(4);
      expect(quarterMissedShotsAndFreeThrowsTotal(result, 202710, 5)).toBe(3);
      expect(quarterMissedShotsAndFreeThrowsTotal(result, 202710, 6)).toBe(0);
      expect(quarterMissedShotsAndFreeThrowsTotal(result, 202710, 7)).toBe(0);
    });

    it('calculates assists by quarter', () => {

      const jimmy = boxScore.homeTeam.players.find(p => p.personId === 202710);
      let result = nbaService.createPlayerPeriodPerformance(playByPlay, jimmy, boxScore.homeTeam.periods);

      expect(quarterAssistsTotal(result, 202710, 1)).toBe(1);
      expect(quarterAssistsTotal(result, 202710, 2)).toBe(2);
      expect(quarterAssistsTotal(result, 202710, 3)).toBe(3);
      expect(quarterAssistsTotal(result, 202710, 4)).toBe(2);
      expect(quarterAssistsTotal(result, 202710, 5)).toBe(1);
      expect(quarterAssistsTotal(result, 202710, 6)).toBe(1);
      expect(quarterAssistsTotal(result, 202710, 7)).toBe(0);
    });

    it('calculates turnvoers by quarter', () => {
      const jimmy = boxScore.homeTeam.players.find(p => p.personId === 202710);
      let result = nbaService.createPlayerPeriodPerformance(playByPlay, jimmy, boxScore.homeTeam.periods);

      expect(quarterTurnoversTotal(result, 202710, 1)).toBe(0);
      expect(quarterTurnoversTotal(result, 202710, 2)).toBe(1);
      expect(quarterTurnoversTotal(result, 202710, 3)).toBe(3);
      expect(quarterTurnoversTotal(result, 202710, 4)).toBe(0);
      expect(quarterTurnoversTotal(result, 202710, 5)).toBe(1);
      expect(quarterTurnoversTotal(result, 202710, 6)).toBe(0);
      expect(quarterTurnoversTotal(result, 202710, 7)).toBe(0);
    });
    it('calculates rebounds by quarter', () => {
      const jimmy = boxScore.homeTeam.players.find(p => p.personId === 202710);
      let result = nbaService.createPlayerPeriodPerformance(playByPlay, jimmy, boxScore.homeTeam.periods);

      // bam adebayo
      const bam = boxScore.homeTeam.players.find(p => p.personId === 1628389);
      result = nbaService.createPlayerPeriodPerformance(playByPlay, bam, boxScore.homeTeam.periods);
      expect(pointsTotal(result, 1628389)).toBe(14);
      expect(quarterReboundsTotal(result, 1628389, 1)).toBe(4);
      expect(quarterReboundsTotal(result, 1628389, 2)).toBe(2);
      expect(quarterReboundsTotal(result, 1628389, 3)).toBe(3);
      expect(quarterReboundsTotal(result, 1628389, 4)).toBe(3);
      expect(quarterReboundsTotal(result, 1628389, 5)).toBe(2);
      expect(quarterReboundsTotal(result, 1628389, 6)).toBe(1);
      expect(quarterReboundsTotal(result, 1628389, 7)).toBe(1);
    });

    it('calculates steals by quarter', () => {
      const siakam = boxScore.awayTeam.players.find(p => p.personId === 1627783);
      let result = nbaService.createPlayerPeriodPerformance(playByPlay, siakam, boxScore.awayTeam.periods);
      expect(quarterStealsTotal(result, 1627783, 1)).toBe(0);
      expect(quarterStealsTotal(result, 1627783, 2)).toBe(1);
      expect(quarterStealsTotal(result, 1627783, 3)).toBe(2);
      expect(quarterStealsTotal(result, 1627783, 4)).toBe(0);
      expect(quarterStealsTotal(result, 1627783, 5)).toBe(0);
      expect(quarterStealsTotal(result, 1627783, 6)).toBe(1);
      expect(quarterStealsTotal(result, 1627783, 7)).toBe(0);

    });

    it('calculates blocks by quarter', () => {
      const siakam = boxScore.awayTeam.players.find(p => p.personId === 1627783);
      let result = nbaService.createPlayerPeriodPerformance(playByPlay, siakam, boxScore.awayTeam.periods);
      expect(quarterBlocksTotal(result, 1627783, 1)).toBe(0);
      expect(quarterBlocksTotal(result, 1627783, 2)).toBe(0);
      expect(quarterBlocksTotal(result, 1627783, 3)).toBe(0);
      expect(quarterBlocksTotal(result, 1627783, 4)).toBe(2);
      expect(quarterBlocksTotal(result, 1627783, 5)).toBe(0);
      expect(quarterBlocksTotal(result, 1627783, 6)).toBe(1);
      expect(quarterBlocksTotal(result, 1627783, 7)).toBe(1);
    });

    it('calculates fouls by quarter', () => {
      const siakam = boxScore.awayTeam.players.find(p => p.personId === 1627783);
      let result = nbaService.createPlayerPeriodPerformance(playByPlay, siakam, boxScore.awayTeam.periods);
      expect(quarterFoulsTotal(result, 1627783, 1)).toBe(1);
      expect(quarterFoulsTotal(result, 1627783, 2)).toBe(1);
      expect(quarterFoulsTotal(result, 1627783, 3)).toBe(1);
      expect(quarterFoulsTotal(result, 1627783, 4)).toBe(0);
      expect(quarterFoulsTotal(result, 1627783, 5)).toBe(1);
      expect(quarterFoulsTotal(result, 1627783, 6)).toBe(0);
      expect(quarterFoulsTotal(result, 1627783, 7)).toBe(1);
    });
  });
});

