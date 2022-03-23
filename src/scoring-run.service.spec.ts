import { BoxScore, PlayByPlay } from './model';
import { ScoringRunService } from './scoring-run.service';

const fs = require('fs');

describe('ShotDistanceService', () => {
  let service: ScoringRunService;
  let playByPlay: PlayByPlay;
  let boxScore: BoxScore;
  beforeEach(() => {
    service = new ScoringRunService();
    playByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-atlnyk.json`)).game;
  });
  it('highest scoring runs for away team is 19', () => {
    const result = service.getScoringRuns(playByPlay);

  })
})
