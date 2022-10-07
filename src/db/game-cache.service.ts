import { Injectable } from '@nestjs/common';
import { redisClient } from './resdis-connection';

@Injectable()
export class GameCacheService {

  async getGameData(gameId: string): Promise<string> {
    return await redisClient.get(`${gameId}-info`);
  }

  setGameData(gameId: string, gameData: any) {
    redisClient.set(`${gameId}-info`, JSON.stringify(gameData));
  }
}
