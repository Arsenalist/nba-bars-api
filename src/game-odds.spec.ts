import { BetMarket, BoxScore, PlayByPlay, Schedule } from './model';
import { LatestGameCalculator } from './latest-game-calculator';
import { GameOdds } from './game-odds';
const fs = require('fs');

describe('GameOdds', () => {
  let gameOdds: GameOdds;
  let betMarkets: BetMarket[];
  beforeEach(async () => {
    betMarkets = JSON.parse(
      fs.readFileSync(`./testdata/thescore-markets.json`).toString(),
    ).data;
    gameOdds = new GameOdds(betMarkets);
  });

  it('Two markets for the Magic - spread and moneyline', () => {
    const teamBettingId = 'a0fd4368-a556-48dd-9186-53f89a4fcfcd';
    const result = gameOdds.calculate(teamBettingId);
    expect(result.event.away_participant.name).toEqual('Orlando Magic');
    expect(result.event.home_participant.name).toEqual('Detroit Pistons');
    expect(result.odds[0].away_points).toEqual('4.5');
    expect(result.odds[0].home_points).toEqual('-4.5');
    expect(result.odds[0].type).toEqual('spread');
    expect(result.odds[0].home_odds.american).toEqual('-110');
    expect(result.odds[0].home_odds.decimal).toEqual('1.91');
    expect(result.odds[0].home_odds.fractional).toEqual('10/11');
    expect(result.odds[0].away_odds.american).toEqual('-110');
    expect(result.odds[0].away_odds.decimal).toEqual('1.91');
    expect(result.odds[0].away_odds.fractional).toEqual('10/11');
    expect(result.odds[1].away_points).toBeUndefined();
    expect(result.odds[1].home_points).toBeUndefined();
    expect(result.odds[1].type).toEqual('moneyline');
    expect(result.odds[1].home_odds.american).toEqual('-182');
    expect(result.odds[1].home_odds.decimal).toEqual('1.55');
    expect(result.odds[1].home_odds.fractional).toEqual('50/91');
    expect(result.odds[1].away_odds.american).toEqual('+148');
    expect(result.odds[1].away_odds.decimal).toEqual('2.48');
    expect(result.odds[1].away_odds.fractional).toEqual('37/25');
  });

  it('Three markets for Atlanta, second is over/under', () => {
    const teamBettingId = '7ee7dbef-b7fe-4056-b8c4-38fd03f9c21e';
    const result = gameOdds.calculate(teamBettingId);
    expect(result.event.away_participant.name).toEqual('Atlanta Hawks');
    expect(result.event.home_participant.name).toEqual('Milwaukee Bucks');
    expect(result.odds[1].away_points).toEqual('225.5');
    expect(result.odds[1].home_points).toEqual('225.5');
    expect(result.odds[1].type).toEqual('total');
    expect(result.odds[1].home_odds.american).toEqual('-110');
    expect(result.odds[1].home_odds.decimal).toEqual('1.91');
    expect(result.odds[1].home_odds.fractional).toEqual('10/11');
    expect(result.odds[1].away_odds.american).toEqual('-110');
    expect(result.odds[1].away_odds.decimal).toEqual('1.91');
    expect(result.odds[1].away_odds.fractional).toEqual('10/11');
  });

  it('No market exists for team', () => {
    const teamBettingId = 'team-id-with-no-markets';
    const result = gameOdds.calculate(teamBettingId);
    expect(result).toBeNull();
  });
});
