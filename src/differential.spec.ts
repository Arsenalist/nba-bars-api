import { Differential } from './differential';
import { Action } from './model';

describe('differential', () => {
  it('calculates summary correctly for a positive differential', () => {
    const action: Action = {
      clock: "PT10M30.00S",
      period: 1,
      scoreAway: "6",
      scoreHome: "1",
    }
    const d = new Differential(action);
    expect(d.summary).toEqual("1st 10:30: 6-1, (5)")
  })
  it('calculates summary correctly for a negative differential', () => {
    const action: Action = {
      clock: "PT10M30.00S",
      period: 2,
      scoreAway: "5",
      scoreHome: "20",
    }
    const d = new Differential(action);
    expect(d.summary).toEqual("2nd 10:30: 5-20, (15)")
  })
})
