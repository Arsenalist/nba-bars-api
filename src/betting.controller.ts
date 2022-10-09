import { Controller, Get, Param } from '@nestjs/common';
import { GameOdds } from './game-odds';
import { TheScoreEventAnalyzer } from './the-score-event-analyzer';
import { TheScoreService } from './the-score.service';

@Controller()
export class BettingController {
  constructor(private readonly theScoreService: TheScoreService) {}
  @Get('/bet-box/:teamBettingId')
  async getBetBox(@Param('teamBettingId') teamBettingId: string) {
    const betMarkets = await this.theScoreService.getBasketballMarkets();
    const gameOdds = new GameOdds(betMarkets);
    const result = gameOdds.calculate(teamBettingId);
    let tvListingsForDisplay;
    let gameDateForDisplay;
    let awayTeamLogo;
    let homeTeamLogo;
    if (result === null) {
      return {
        status: 'NO_MARKETS_FOUND',
        payload: {},
      };
    } else {
      if (
        result.event.away_participant.resource_uri &&
        result.event.home_participant.resource_uri
      ) {
        const awayTeamId = parseInt(
          result.event.away_participant.resource_uri.split('/')[3],
        );
        const homeTeamId = parseInt(
          result.event.home_participant.resource_uri.split('/')[3],
        );
        awayTeamLogo = `https://assets-sports.thescore.com/basketball/team/${awayTeamId}/w72xh72_logo.png`;
        homeTeamLogo = `https://assets-sports.thescore.com/basketball/team/${homeTeamId}/w72xh72_logo.png`;;
        const currentGameResourceUri =
          await this.theScoreService.getCurrentGameResourceUri(awayTeamId);
        const upcomingGameResourceUri =
          await this.theScoreService.getUpcomingGameResourceUri(awayTeamId);
        const event = await this.theScoreService.getEventDetails(
          currentGameResourceUri
            ? currentGameResourceUri
            : upcomingGameResourceUri,
        );
        const analyzer = new TheScoreEventAnalyzer(event);
        tvListingsForDisplay = analyzer.getTvListingsForDisplay();
        gameDateForDisplay = analyzer.getGameTime();
      }
      return {
        status: 'OK',
        payload: result,
        tvListingsForDisplay: tvListingsForDisplay,
        gameDateForDisplay: gameDateForDisplay,
        awayTeamLogo: awayTeamLogo,
        homeTeamLogo: homeTeamLogo,
      };
    }
  }
}
