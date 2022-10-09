import { BettingController } from './betting.controller';
import { TheScoreService } from './the-score.service';
jest.mock('./the-score.service');

describe('BettingController', () => {
  let bettingController;
  let theScoreService;
  beforeEach(() => {
    theScoreService = new TheScoreService(null);
    bettingController = new BettingController(theScoreService);
  });

  it('No markets found when there are no basketball markets', async () => {
    jest.spyOn(theScoreService, 'getBasketballMarkets').mockReturnValue([]);
    expect((await bettingController.getBetBox('')).status).toEqual(
      'NO_MARKETS_FOUND',
    );
  });
  it('If game odds were not available based on betting markets, return NO_MARKETS_FOUND', async () => {
    jest.spyOn(theScoreService, 'getBasketballMarkets').mockReturnValue([

    ]);
    expect((await bettingController.getBetBox('')).status).toEqual(
      'NO_MARKETS_FOUND',
    );
  });

});
