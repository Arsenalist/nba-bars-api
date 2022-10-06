import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { BoxScore, PlayByPlay } from './model';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NbaService {

  constructor(private httpService: HttpService) {
  }

  async getBoxScore(gameId: string): Promise<BoxScore> {
    const url = `https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`;
    return await lastValueFrom(this.httpService.get(url).pipe(map(response => response.data.game)));
  }

  async getPlayByPlay(gameId: number): Promise<PlayByPlay>  {
    const url = `https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_${gameId}.json`;
    return await lastValueFrom(this.httpService.get(url).pipe(map(response => response.data.game)));
  }

  async getGames(date: string) {
    const url =`https://ca.global.nba.com/stats2/scores/daily.json?countryCode=CA&gameDate=${date}&locale=en&tz=-5`;
    return await lastValueFrom(this.httpService.get(url).pipe(map(response => response.data.payload.date ? response.data.payload.date.games : [])));
  }

  async getSchedule(teamCode: string) {
    const url =`http://global.nba.com/statsm2/team/schedule.json?countryCode=CA&locale=en&teamCode=${teamCode}`;
    return await lastValueFrom(this.httpService.get(url).pipe(map(response => response.data.payload ? response.data.payload : [])));
  }

}
