import * as dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/customParseFormat'))
dayjs.extend(require('dayjs/plugin/advancedFormat'))

const SECONDS_IN_QUARTER = 720;
const SECONDS_IN_OT = 300;
const CLOCK_FORMAT = "PTmmss.SS";
const START_OF_QUARTER_CLOCK = "PT12M00.00S";
const START_OF_OT_CLOCK = "PT05M00.00S";
const NUMBER_OF_QUARTERS_IN_GAME = 4;
export class Clock {


  constructor(private readonly clock: string, private readonly period: number) { }


  elapsedTime(): number {

    const currentTime = dayjs(this.clock, CLOCK_FORMAT);
    let startOfPeriod;
    if (this.period <= 4) {
      startOfPeriod = dayjs(START_OF_QUARTER_CLOCK, CLOCK_FORMAT);
    } else {
      startOfPeriod = dayjs(START_OF_OT_CLOCK, CLOCK_FORMAT);
    }
    return currentTime.diff(startOfPeriod, "second") * -1 + this.secondsInCompletedPeriods();
  }

  displayTime(): string {
    const time = dayjs(this.clock, CLOCK_FORMAT);
    const formattedTime = time.format("mm:ss")
    if (this.period <= NUMBER_OF_QUARTERS_IN_GAME) {
      return `${this.ordinal_suffix_of(this.period)} ${formattedTime}`;
    } else {
      return `${this.ordinal_suffix_of(this.period - NUMBER_OF_QUARTERS_IN_GAME)} OT ${formattedTime}`;
    }
  }

  private secondsInCompletedPeriods(): number {
    if (this.period <= NUMBER_OF_QUARTERS_IN_GAME) {
      return (this.period - 1) * SECONDS_IN_QUARTER;
    } else {
      return (SECONDS_IN_QUARTER * NUMBER_OF_QUARTERS_IN_GAME) +
        (this.period - NUMBER_OF_QUARTERS_IN_GAME - 1)  * SECONDS_IN_OT;
    }
  }

  private ordinal_suffix_of(i): string {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }
}
