import { BoxScore, HomeAway, PlayByPlay, Shot } from './model';
import { ShotDistanceService } from './shot-distance.service';
const fs = require('fs');

describe('ShotDistanceService', () => {
  let service: ShotDistanceService;
  let playByPlay: PlayByPlay;
  let boxScore: BoxScore;
  beforeEach(() => {
    service = new ShotDistanceService();
    playByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-tormia.json`)).game;
    boxScore = JSON.parse(fs.readFileSync(`./testdata/boxscore-tormia.json`)).game;
  });
  it('creates shot distance for team', () => {
    const result: Shot[] = service.getTeamShotDistances(HomeAway.AWAY, boxScore, playByPlay);
    expect(result[0].action.shotDistance).toEqual(7.98);
    expect(result[0].action.shotResult).toEqual("Made");
    expect(result[0].action.playerNameI).toEqual("P. Siakam");
    expect(result[0].gameClockInSeconds).toEqual(68);
  })
})
