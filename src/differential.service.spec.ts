import { DifferentialService } from './differential.service';
import { PlayByPlay } from './model';
import { Differential } from './differential';
const fs = require('fs');

describe('differential', () => {
  let service: DifferentialService;
  let playByPlay: PlayByPlay;
  beforeEach(() => {
    service = new DifferentialService();
    playByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-tormia.json`)).game;
  });
  it ('returns differential every 10 seconds', () => {
    const result: Differential[] = service.createDifferential(playByPlay);
    expect(result[0].elapsedTimeInSeconds).toBe(0);
    expect(result[0].awayMinusHomeDifference).toBe(0);
    expect(result[12].elapsedTimeInSeconds).toBe(90);
    expect(result[12].awayMinusHomeDifference).toBe(-1);
  });
})
