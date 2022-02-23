import { BoxScore, HomeAway, PlayByPlay, Shot } from './model';
import { PointsQualifierService } from './points-qualifier-service';
const fs = require('fs');

describe('ShotDistanceService', () => {
  let service: PointsQualifierService;
  let playByPlay: PlayByPlay;
  let boxScore: BoxScore;
  beforeEach(() => {
    service = new PointsQualifierService();
    playByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-tormia.json`)).game;
    boxScore = JSON.parse(fs.readFileSync(`./testdata/boxscore-tormia.json`)).game;
  });
  it('get fast break points for team', () => {
    const result = service.getFastBreakPointsByPeriod(HomeAway.AWAY, boxScore, playByPlay);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(9);
    expect(result[2]).toBe(11);
    expect(result[3]).toBe(0);
    expect(result[4]).toBe(0);
    expect(result[5]).toBe(2);
    expect(result[6]).toBe(0);
  })
  it('get points off turnovers for team', () => {
    const result = service.getPointsScoredOffTurnovers(HomeAway.AWAY, boxScore, playByPlay);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(2);
    expect(result[3]).toBe(4);
    expect(result[4]).toBe(0);
    expect(result[5]).toBe(0);
    expect(result[6]).toBe(0);
  })
  it('get points in the paint for team', () => {
    const result = service.getPointsInThePaintByPeriod(HomeAway.AWAY, boxScore, playByPlay);
    expect(result[0]).toBe(12);
    expect(result[1]).toBe(14);
    expect(result[2]).toBe(10);
    expect(result[3]).toBe(8);
    expect(result[4]).toBe(2);
    expect(result[5]).toBe(4);
    expect(result[6]).toBe(2);
  })
})
