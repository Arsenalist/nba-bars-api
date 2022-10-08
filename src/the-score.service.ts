import { Injectable } from '@nestjs/common';
import { BetMarket, BoxScore, HomeAway, PlayByPlay, Shot } from './model';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TheScoreService {
  constructor(private httpService: HttpService) {}

  async getBasketballMarkets(): Promise<BetMarket[]> {
    console.log("process.env is ", process.env)
    const headersRequest = {
      'x-api-key': process.env.THE_SCORE_API_KEY,
    };
    const url = `https://vegas.us-core.uat.thescore.bet/api/v1/markets?sport_slug=basketball&most_balanced=true&market_classification_name=main&page=1&page_size=100`;
    return await lastValueFrom(
      this.httpService
        .get(url, { headers: headersRequest })
        .pipe(
          map((response) => (response.data.data ? response.data.data : [])),
        ),
    );
  }
}
