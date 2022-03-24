import { BoxScore, PlayByPlay } from './model';
import { ScoringRunService } from './scoring-run.service';

const fs = require('fs');

describe('ShotDistanceService', () => {
  let service: ScoringRunService;
  let playByPlay: PlayByPlay;
  let boxScore: BoxScore;
  beforeEach(() => {
    service = new ScoringRunService();
    playByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-tormia.json`)).game;
  });
  it('creates shot distance for team', () => {
    const result = service.getScoringRuns(playByPlay);
    expect(result.awayScoringRuns[0].difference).toEqual(19);
    expect(result.awayScoringRuns[0].startAction.actionNumber).toEqual(36);
    expect(result.awayScoringRuns[0].endAction.actionNumber).toEqual(229);
  })
})
