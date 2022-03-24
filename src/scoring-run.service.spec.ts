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
  it('highest scoring runs for away team is 23', () => {
    const result = service.getScoringRuns(playByPlay);
    expect(result.awayScoringRuns[0].difference).toEqual(23);
    expect(result.awayScoringRuns[0].startAction.actionNumber).toEqual(200);
    expect(result.awayScoringRuns[0].endAction.actionNumber).toEqual(365);
    expect(result.awayScoringRuns[0].durationInSeconds).toEqual(846);
  })
})
