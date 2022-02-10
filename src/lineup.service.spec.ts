import { LineupService } from './lineup.service';
import { Lineup } from './lineup';
import { BoxScore, HomeAway, PlayByPlay } from './model';
const fs = require('fs');

describe('LineupService', () => {
  let service: LineupService;
  let playByPlay: PlayByPlay;
  let boxScore: BoxScore;
  beforeEach(async () => {
    playByPlay = JSON.parse(fs.readFileSync(`./testdata/playbyplay-tormia.json`)).game;
    boxScore = JSON.parse(fs.readFileSync(`./testdata/boxscore-tormia.json`)).game;
    service = new LineupService();
  });

  it ('returns the away team lineup which started the game', () => {
    const lineups: Lineup[] = service.getLineups(HomeAway.AWAY, playByPlay, boxScore);
    expect(lineups[0].players.find(p => p.personId === 1630567).name).toBe("Scottie Barnes");
    expect(lineups[0].players.find(p => p.personId === 1628384).name).toBe("OG Anunoby");
    expect(lineups[0].players.find(p => p.personId === 1627783).name).toBe("Pascal Siakam");
    expect(lineups[0].players.find(p => p.personId === 1629018).name).toBe("Gary Trent Jr.");
    expect(lineups[0].players.find(p => p.personId === 1627832).name).toBe("Fred VanVleet");
    expect(lineups[0].players.length).toBe(5);
    // Chris Boucher did not start
    expect(lineups[0].players.find(p => p.personId === 1628449)).toBe(undefined);
    expect(lineups[0].plusMinus).toBe(1);
    let stats = lineups[0].playersWithStats;
    // barnes had a foul
    expect(stats.find(p => p.personId === 1630567).lineupStats.fouls).toBe(1);
    // trent
    expect(stats.find(p => p.personId === 1629018).lineupStats.points).toBe(5);
    expect(stats.find(p => p.personId === 1629018).lineupStats.fouls).toBe(1);

    expect(lineups[1].players.find(p => p.personId === 1628449).name).toBe("Chris Boucher");
    expect(lineups[1].players.find(p => p.personId === 1628384).name).toBe("OG Anunoby");
    expect(lineups[1].players.find(p => p.personId === 1627783).name).toBe("Pascal Siakam");
    expect(lineups[1].players.find(p => p.personId === 1629018).name).toBe("Gary Trent Jr.");
    expect(lineups[1].players.find(p => p.personId === 1627832).name).toBe("Fred VanVleet");
    expect(lineups[1].players.length).toBe(5);
    // Scottie Barnes was subbed off
    expect(lineups[1].players.find(p => p.personId === 1630567)).toBe(undefined);
    expect(lineups[1].plusMinus).toBe(3);

    expect(lineups[2].players.find(p => p.personId === 1630567).name).toBe("Scottie Barnes");
    expect(lineups[2].players.find(p => p.personId === 1627783).name).toBe("Pascal Siakam");
    expect(lineups[2].players.find(p => p.personId === 1629018).name).toBe("Gary Trent Jr.");
    expect(lineups[2].players.find(p => p.personId === 1627832).name).toBe("Fred VanVleet");
    expect(lineups[2].players.find(p => p.personId === 1628449).name).toBe("Chris Boucher");
    expect(lineups[2].players.length).toBe(5);
    // OG Anunoby was subbed off
    expect(lineups[2].players.find(p => p.personId === 1628384)).toBe(undefined);
    expect(lineups[2].plusMinus).toBe(0);

    expect(lineups[3].players.find(p => p.personId === 1630567).name).toBe("Scottie Barnes");
    expect(lineups[3].players.find(p => p.personId === 1630173).name).toBe("Precious Achiuwa");
    expect(lineups[3].players.find(p => p.personId === 1629018).name).toBe("Gary Trent Jr.");
    expect(lineups[3].players.find(p => p.personId === 1627832).name).toBe("Fred VanVleet");
    expect(lineups[3].players.find(p => p.personId === 1628449).name).toBe("Chris Boucher");
    expect(lineups[3].players.length).toBe(5);
    // Siakam was subbed off
    expect(lineups[3].players.find(p => p.personId === 1627783)).toBe(undefined);
    expect(lineups[3].plusMinus).toBe(-1);
  });
  it ('returns the home team lineup which ended the game', () => {
    const lineups: Lineup[] = service.getLineups(HomeAway.HOME, playByPlay, boxScore);
    let lineup = lineups[lineups.length-1];
    expect(lineup.players.find(p => p.personId === 202710).name).toBe("Jimmy Butler");
    expect(lineup.players.find(p => p.personId === 1629639).name).toBe("Tyler Herro");
    expect(lineup.players.find(p => p.personId === 1629216).name).toBe("Gabe Vincent");
    expect(lineup.players.find(p => p.personId === 1628389).name).toBe("Bam Adebayo");
    expect(lineup.players.find(p => p.personId === 200782).name).toBe("P.J. Tucker");
    expect(lineup.players.length).toBe(5);
    // Dedmon got subbed out
    expect(lineup.players.find(p => p.personId === 203473)).toBe(undefined);
    // gabe vincent had one turnover just before the end of the game
    let stats = lineup.playersWithStats;
    expect(stats.find(p => p.personId === 1629216).lineupStats.turnovers).toBe(1);

    lineup = lineups[lineups.length-2];
    expect(lineup.players.find(p => p.personId === 202710).name).toBe("Jimmy Butler");
    expect(lineup.players.find(p => p.personId === 203473).name).toBe("Dewayne Dedmon");
    expect(lineup.players.find(p => p.personId === 1629216).name).toBe("Gabe Vincent");
    expect(lineup.players.find(p => p.personId === 1628389).name).toBe("Bam Adebayo");
    expect(lineup.players.find(p => p.personId === 200782).name).toBe("P.J. Tucker");
    expect(lineup.players.length).toBe(5);
    // Herro got subbed out
    expect(lineup.players.find(p => p.personId === 1629639)).toBe(undefined);

  });

});
