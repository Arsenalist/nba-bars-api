import { Injectable } from '@nestjs/common';
import { BetMarket, TheScoreEvent } from './model';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TheScoreService {
  constructor(private httpService: HttpService) {}

  async getBasketballMarkets(): Promise<BetMarket[]> {
    const headersRequest = {
      'x-api-key': process.env.THE_SCORE_API_KEY,
    };
    const url = `https://vegas.us-core.uat.thescore.bet/api/v1/markets?competition_slug=nba&organization_slug=united-states&sport_slug=basketball&most_balanced=true&market_classification_name=main&page=1&page_size=100`;
    return await lastValueFrom(
      this.httpService
        .get(url, { headers: headersRequest })
        .pipe(
          map((response) => (response.data.data ? response.data.data : [])),
        ),
    );
  }

  async getUpcomingGameResourceUri(teamId: number): Promise<string> {
    const url = `https://api.thescore.com/nba/teams/${teamId}/events/upcoming?rpp=1`;
    return await lastValueFrom(
      this.httpService
        .get(url)
        .pipe(
          map((response) =>
            response.data.length !== 0 ? response.data[0].api_uri : null,
          ),
        ),
    );
  }

  async getCurrentGameResourceUri(teamId: number): Promise<string> {
    const url = `https://api.thescore.com/nba/teams/${teamId}/events/current`;
    return await lastValueFrom(
      this.httpService
        .get(url)
        .pipe(
          map((response) =>
            response.data.length !== 0 ? response.data[0].api_uri : null,
          ),
        ),
    );
  }

  async getEventDetails(resourceUri: string): Promise<TheScoreEvent> {
    const url = `https://api.thescore.com${resourceUri}`;
    return await lastValueFrom(
      this.httpService
        .get(url)
        .pipe(map((response) => (response.data ? response.data : null))),
    );
  }
}
