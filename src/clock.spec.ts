import { Clock } from './clock';

describe('clock', () => {
  describe('elapsedTime()', () => {
    it('returns elapsed time in first period', () => {
      const clock = new Clock('PT11M45.00S', 1);
      expect(clock.elapsedTime()).toBe(15);
    });
    it('returns elapsed time in second period', () => {
      const clock = new Clock('PT00M45.00S', 2);
      expect(clock.elapsedTime()).toBe(675 + 720);
    });
    it('returns elapsed time at end of the first quarter', () => {
      const clock = new Clock('PT00M00.00S', 1);
      expect(clock.elapsedTime()).toBe(720);
    });
    it('returns elapsed time at end of the second quarter', () => {
      const clock = new Clock('PT00M00.00S', 2);
      expect(clock.elapsedTime()).toBe(720 * 2);
    });
    it('returns elapsed time at end of the third quarter', () => {
      const clock = new Clock('PT00M00.00S', 3);
      expect(clock.elapsedTime()).toBe(720 * 3);
    });
    it('returns elapsed time at end of the fourth quarter', () => {
      const clock = new Clock('PT00M00.00S', 4);
      expect(clock.elapsedTime()).toBe(720 * 4);
    });
    it('returns elapsed time in the middle of first OT', () => {
      const clock = new Clock('PT02M30.00S', 5);
      expect(clock.elapsedTime()).toBe(720 * 4 + 150);
    });
  });
  describe('displayTime()', () => {
    it('display a generic time in first quarter', () => {
      const clock = new Clock('PT11M45.00S', 1);
      expect(clock.displayTime()).toBe("1st 11:45");
    });
    it('display a time at beginning of quarter', () => {
      const clock = new Clock('PT12M00.00S', 2);
      expect(clock.displayTime()).toBe("2nd 12:00");
    });
    it('display a time in fourth quarter', () => {
      const clock = new Clock('PT00M01.00S', 4);
      expect(clock.displayTime()).toBe("4th 00:01");
    });
    it('display a time in first OT', () => {
      const clock = new Clock('PT00M01.00S', 5);
      expect(clock.displayTime()).toBe("1st OT 00:01");
    });
    it('display a time at the end of second OT', () => {
      const clock = new Clock('PT00M00.00S', 6);
      expect(clock.displayTime()).toBe("2nd OT 00:00");
    });
  });
});
