import { Action, HomeAway, Player } from './model';
import { GameBarService } from './game-bar.service';

export class Lineup {
  constructor(private homeAway: HomeAway) {
  }
  private _players: Player[] = [];
  private _firstAction: Action;
  private _lastAction: Action;
  private _actions: Action[];

  get players(): Player[] {
    return this._players;
  }
  set players(value: Player[]) {
    this._players = value;
  }

  get plusMinus(): number {
    if (this.homeAway == HomeAway.AWAY) {
      const startDifferential = parseInt(this._firstAction.scoreAway) - parseInt(this._firstAction.scoreHome);
      const endDifferential =  parseInt(this._lastAction.scoreAway) - parseInt(this._lastAction.scoreHome);
      return endDifferential - startDifferential;
    } else {
      const startDifferential = parseInt(this._firstAction.scoreHome) - parseInt(this._firstAction.scoreAway);
      const endDifferential =  parseInt(this._lastAction.scoreHome) - parseInt(this._lastAction.scoreAway);
      return endDifferential - startDifferential;
    }
  }

  get firstAction(): Action {
    return this._firstAction;
  }
  set firstAction(value: Action) {
    this._firstAction = value;
  }

  get lastAction(): Action {
    return this._lastAction;
  }
  set lastAction(value: Action) {
    this._lastAction = value;
  }

  get actions(): Action[] {
    return this._actions;
  }
  set actions(value: Action[]) {
    this._actions = value;
  }

  get playersWithStats(): Player[] {
    const service = new GameBarService();
    return this._players.map(p => {
      p.stats = service.calculateStatsForPlayerForPeriod(this._actions, p, undefined);
      return p;
    })
  }

}
