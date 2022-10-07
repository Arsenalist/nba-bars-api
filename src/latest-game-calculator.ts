import { Game, Schedule } from './model';
import * as dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/customParseFormat'));

export class LatestGameCalculator {
  private schedule: Schedule;

  constructor(schedule: Schedule) {
    this.schedule = schedule;
  }

  getLatestGame = (dateInEdt: Date): Game => {
    const games = this.schedule.monthGroups.map((mg) => mg.games).flat();
    const filtered = games.filter((g) =>
      dayjs(g.profile.dateTimeEt, 'YYYY-MM-DDTHH:mm').isBefore(
        dayjs(dateInEdt),
      ),
    );
    return filtered.length === 0 ? null : filtered[filtered.length - 1];
  };
}
