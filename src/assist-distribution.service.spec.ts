import { AssistDistributionService } from './assist-distribution.service';
import { BoxScore, PlayByPlay } from './model';
import { AssistDistribution } from './assist-distribution';
const fs = require('fs');

describe('assist distribution', () => {
  let service: AssistDistributionService;
  let boxScore: BoxScore;
  let playByPlay: PlayByPlay;
  beforeEach(() => {
    service = new AssistDistributionService();
    boxScore = JSON.parse(fs.readFileSync(`./testdata/boxscore-tormia.json`)).game;
    playByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-tormia.json`)).game;
  });
  it('calculates the assist distribution of players', () => {
    const result: AssistDistribution[] = service.getAssistDistribution(boxScore.homeTeam.players, playByPlay);
    const jimmy = result.find(ad => ad.player.personId === 202710);
    expect(jimmy.player.personId).toBe(202710);
    expect(jimmy.assistScorers[0].player.personId).toBe(200782);
    expect(jimmy.assistScorers[0].numberOfAssists).toBe(3);
    expect(jimmy.assistScorers[1].player.personId).toBe(1629639);
    expect(jimmy.assistScorers[1].numberOfAssists).toBe(2);
    expect(jimmy.assistScorers[2].player.personId).toBe(1628389);
    expect(jimmy.assistScorers[2].numberOfAssists).toBe(1);
    expect(jimmy.assistScorers[3].player.personId).toBe(203473);
    expect(jimmy.assistScorers[3].numberOfAssists).toBe(1);
    expect(jimmy.assistScorers[4].player.personId).toBe(1629622);
    expect(jimmy.assistScorers[4].numberOfAssists).toBe(1);
    expect(jimmy.assistScorers[5].player.personId).toBe(1629216);
    expect(jimmy.assistScorers[5].numberOfAssists).toBe(2);
  })
})

