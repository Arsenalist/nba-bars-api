import { Injectable } from '@nestjs/common';
import { PlayByPlay } from './model';
import { Differential } from './differential';

@Injectable()
export class DifferentialService {

  createDifferential(playByPlay: PlayByPlay): Differential[] {
    return playByPlay.actions.map(a => new Differential(a));
  }
}
