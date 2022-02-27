import { BoxScore, PlayByPlay } from './model';
import { TimeoutService } from './timeout.service';
const fs = require('fs');

describe('TimeoutService', () => {
  let service: TimeoutService;
  let playByPlay: PlayByPlay;
  let boxScore: BoxScore;
  beforeEach(() => {
    service = new TimeoutService();
    playByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-tormia.json`)).game;
    boxScore = JSON.parse(fs.readFileSync(`./testdata/boxscore-tormia.json`)).game;
  });
  it('first timeout in game called by Miami', () => {
    const result = service.getTimeoutAnalysis(boxScore, playByPlay);
    expect(result[0].timeoutAction.actionNumber).toEqual(60);

    expect(result[0].afterRun.actions[0].actionNumber).toEqual(61);
    expect(result[0].afterRun.actions[result[0].afterRun.actions.length-1].actionNumber).toEqual(117);
    expect(result[0].afterRun.awayScore).toEqual(11);
    expect(result[0].afterRun.homeScore).toEqual(9)
  });
  it('second timeout in game called by Toronto', () => {
    const result = service.getTimeoutAnalysis(boxScore, playByPlay);
    expect(result[1].timeoutAction.actionNumber).toEqual(118);
    expect(result[1].afterRun.actions[0].actionNumber).toEqual(119);
    expect(result[1].afterRun.actions[result[1].afterRun.actions.length-1].actionNumber).toEqual(167);
    expect(result[1].afterRun.awayScore).toEqual(4);
    expect(result[1].afterRun.homeScore).toEqual(6)

  });

});
