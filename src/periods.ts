const NUMBER_OF_QUARTERS_IN_GAME = 4;
const SECONDS_IN_QUARTER = 60 * 12;
const SECONDS_IN_OT = 60 * 5;
export class Periods {

  constructor(private readonly numberOfPeriods: number) {
  }


  display(): string[] {
    if (this.numberOfPeriods <= NUMBER_OF_QUARTERS_IN_GAME) {
      return this.getPeriodStrings(this.numberOfPeriods, "Q");
    } else {
      return this.getPeriodStrings(NUMBER_OF_QUARTERS_IN_GAME, "Q")
        .concat(this.getPeriodStrings(this.numberOfPeriods - NUMBER_OF_QUARTERS_IN_GAME, "OT"));
    }
  }

  intervalsInSeconds(): number[] {
    const result = [];
    for (let i=0; i<this.numberOfPeriods; i++) {
      if (i+1 <= NUMBER_OF_QUARTERS_IN_GAME) {
        if (result.length === 0) {
          result.push(SECONDS_IN_QUARTER);
        } else {
          result.push(result[result.length-1] + SECONDS_IN_QUARTER);
        }
      } else {
        result.push(result[result.length-1] + SECONDS_IN_OT);
      }
    }
    return result;
  }


  private getPeriodStrings(periods: number, prefix: string) {
    const result = [];
    for (let i=0; i<periods; i++) {
      result.push(`${prefix}${i+1}`);
    }
    return result;
  }
}
