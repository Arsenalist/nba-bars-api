import {
  BetMarket,
  TableColumnOdds,
  TableOdds,
} from './model';
export class GameOdds {
  private betMarkets: BetMarket[];

  constructor(betMarkets: BetMarket[]) {
    this.betMarkets = betMarkets;
  }

  calculate = (teamBettingId: string): TableOdds => {
    let markets = this.findAllMarketsForTeam(teamBettingId);
    if (markets.length === 0) {
      return null;
    }
    const event = markets[0].event;
    markets = this.findMarketsByEventId(event.id);
    const templateOdds = {
      away_odds: undefined,
      away_points: undefined,
      home_odds: undefined,
      home_points: undefined,
      type: undefined,
    };
    const tableColumnOdds: TableColumnOdds[] = [];
    markets.map((market) => {
      const odds = { ...templateOdds, type: market.type };
      market.selections.forEach((s) => {
        odds.type = market.type;
        if (
          s.type === 'away_spread' ||
          s.type === 'away_moneyline' ||
          s.type === 'over'
        ) {
          odds.away_points = s.points ? `${s.points}` : undefined;
          odds.away_odds = s.odds;
        }
        if (
          s.type === 'home_spread' ||
          s.type === 'home_moneyline' ||
          s.type === 'under'
        ) {
          odds.home_points = s.points ? `${s.points}` : undefined;
          odds.home_odds = s.odds;
        }
      });
      tableColumnOdds.push(odds);
    });

    return {
      event: event,
      odds: tableColumnOdds,
    };
  };

  private findMarketsByEventId(eventId: string) {
    return this.betMarkets.filter((market) => market.event.id === eventId);
  }

  private findAllMarketsForTeam(teamBettingId: string) {
    return this.betMarkets.filter(
      (market) =>
        market.event.away_participant.id === teamBettingId ||
        market.event.home_participant.id === teamBettingId
    );
  }
}
