import { LineupService } from './lineup.service';
import { Lineup } from './lineup';
import { BoxScore, PlayByPlay } from './model';
const fs = require('fs');

describe('LineupService', () => {
  let service: LineupService;
  beforeEach(async () => {
    const playByPlay: PlayByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-tormia.json`)).game;
    const boxScore: BoxScore = JSON.parse(fs.readFileSync(`./testdata/boxscore-tormia.json`)).game;
    service = new LineupService(playByPlay, boxScore);
  });

  it ('returns the away team lineup which started the game', () => {
    const lineups: Lineup[] = service.getAwayLineups();
    expect(lineups[0].players.find(p => p.personId === 1630567).name).toBe("Scottie Barnes");
    expect(lineups[0].players.find(p => p.personId === 1628384).name).toBe("OG Anunoby");
    expect(lineups[0].players.find(p => p.personId === 1627783).name).toBe("Pascal Siakam");
    expect(lineups[0].players.find(p => p.personId === 1629018).name).toBe("Gary Trent Jr.");
    expect(lineups[0].players.find(p => p.personId === 1627832).name).toBe("Fred VanVleet");
    // Chris Boucher did not start
    expect(lineups[0].players.find(p => p.personId === 1628449)).toBe(undefined);
    expect(lineups[0].plusMinus).toBe(1);
    let stats = lineups[0].playersWithStats;
    // barnes had a foul
    expect(stats.find(p => p.personId === 1630567).stats.fouls).toBe(1);
    // trent
    expect(stats.find(p => p.personId === 1629018).stats.points).toBe(5);
    expect(stats.find(p => p.personId === 1629018).stats.fouls).toBe(1);



    expect(lineups[1].players.find(p => p.personId === 1628449).name).toBe("Chris Boucher");
    expect(lineups[1].players.find(p => p.personId === 1628384).name).toBe("OG Anunoby");
    expect(lineups[1].players.find(p => p.personId === 1627783).name).toBe("Pascal Siakam");
    expect(lineups[1].players.find(p => p.personId === 1629018).name).toBe("Gary Trent Jr.");
    expect(lineups[1].players.find(p => p.personId === 1627832).name).toBe("Fred VanVleet");
    // Scottie Barnes was subbed off
    expect(lineups[1].players.find(p => p.personId === 1630567)).toBe(undefined);
    expect(lineups[1].plusMinus).toBe(3);

    expect(lineups[2].players.find(p => p.personId === 1630567).name).toBe("Scottie Barnes");
    expect(lineups[2].players.find(p => p.personId === 1627783).name).toBe("Pascal Siakam");
    expect(lineups[2].players.find(p => p.personId === 1629018).name).toBe("Gary Trent Jr.");
    expect(lineups[2].players.find(p => p.personId === 1627832).name).toBe("Fred VanVleet");
    expect(lineups[2].players.find(p => p.personId === 1628449).name).toBe("Chris Boucher");
    // OG Anunoby was subbed off
    expect(lineups[2].players.find(p => p.personId === 1628384)).toBe(undefined);
    expect(lineups[2].plusMinus).toBe(0);

    expect(lineups[3].players.find(p => p.personId === 1630567).name).toBe("Scottie Barnes");
    expect(lineups[3].players.find(p => p.personId === 1630173).name).toBe("Precious Achiuwa");
    expect(lineups[3].players.find(p => p.personId === 1629018).name).toBe("Gary Trent Jr.");
    expect(lineups[3].players.find(p => p.personId === 1627832).name).toBe("Fred VanVleet");
    expect(lineups[3].players.find(p => p.personId === 1628449).name).toBe("Chris Boucher");
    // Siakam was subbed off
    expect(lineups[3].players.find(p => p.personId === 1627783)).toBe(undefined);
    expect(lineups[3].plusMinus).toBe(-1);


  })

});
