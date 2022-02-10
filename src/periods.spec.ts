import { Periods } from './periods';

describe('periods', () => {
  describe('display()', () => {
    it('four quarters', () => {
      const periods = new Periods(4);
      expect(periods.display()).toEqual(["Q1", "Q2", "Q3", "Q4"]);
    });
    it('first quarter', () => {
      const periods = new Periods(1);
      expect(periods.display()).toEqual(["Q1"]);
    });
    it('OT1', () => {
      const periods = new Periods(5);
      expect(periods.display()).toEqual(["Q1", "Q2", "Q3", "Q4", "OT1"]);
    });
    it('OT2', () => {
      const periods = new Periods(6);
      expect(periods.display()).toEqual(["Q1", "Q2", "Q3", "Q4", "OT1", "OT2"]);
    });
    it('OT2', () => {
      const periods = new Periods(7);
      expect(periods.display()).toEqual(["Q1", "Q2", "Q3", "Q4", "OT1", "OT2", "OT3"]);
    });
  });
  describe('intervalInSeconds()', () => {
    it('four quarters', () => {
      const periods = new Periods(4);
      expect(periods.intervalsInSeconds()).toEqual([720, 1440, 2160, 2880]);
    });
    it('first quarter', () => {
      const periods = new Periods(1);
      expect(periods.intervalsInSeconds()).toEqual([720]);
    });
    it('OT1', () => {
      const periods = new Periods(5);
      const actual = periods.intervalsInSeconds();
      expect(actual).toEqual([720, 1440, 2160, 2880, 3180]);
    });
    it('OT2', () => {
      const periods = new Periods(6);
      const actual = periods.intervalsInSeconds();
      expect(actual).toEqual([720, 1440, 2160, 2880, 3180, 3480]);
    });
  });
});
