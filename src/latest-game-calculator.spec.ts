import { BoxScore, PlayByPlay, Schedule } from './model';
const fs = require('fs');
import { LatestGameCalculator } from './latest-game-calculator';
import * as dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/customParseFormat'));

function date(date: string) {
  return dayjs(date, 'YYYY-MM-DD HH:mm').toDate();
}
describe('LatestGameCalculator', () => {
  let latestGameCalculator: LatestGameCalculator;
  let schedule: Schedule;
  beforeEach(async () => {
    schedule = JSON.parse(
      fs.readFileSync(`./testdata/schedule-raptors.json`).toString(),
    ).payload;
    latestGameCalculator = new LatestGameCalculator(schedule);
  });

  it('selects the Jazz pre-season game (first game) if right now is October 2 at 7:34 PM', () => {
    expect(
      latestGameCalculator.getLatestGame(date('2022-10-02 19:34')).profile
        .gameId,
    ).toEqual('0012200006');
  });

  it('selects the last regular season game a minute after tip-off of the last game', () => {
    expect(
      latestGameCalculator.getLatestGame(date('2023-04-10 13:01')).profile
        .gameId,
    ).toEqual('0022201221');
  });

  it('return null if no games have been played yet', () => {
    expect(
      latestGameCalculator.getLatestGame(date('2022-09-01 15:55')),
    ).toBeNull();
  });
});
