import { ScoreDifference } from './score-difference';

describe('ScoreDifference', () => {
  describe('isOverlappingWith', () => {
    const scoreDifference = new ScoreDifference({
      startAction: {actionNumber: 5},
      endAction: {actionNumber: 15}
    });

    it ('run is contained entirely within main run', () => {
      expect(scoreDifference.isOverlappingWith(new ScoreDifference({
        startAction: {actionNumber: 6},
        endAction: {actionNumber: 9}
      }))).toBeTruthy();
    });

    it ('run is contained partially within main run (end is outside of main run)', () => {
      expect(scoreDifference.isOverlappingWith(new ScoreDifference({
        startAction: {actionNumber: 8},
        endAction: {actionNumber: 16}
      }))).toBeTruthy();
    });

    it ('run is contained partially within main run (start is outside of main run)', () => {
      expect(scoreDifference.isOverlappingWith(new ScoreDifference({
        startAction: {actionNumber: 2},
        endAction: {actionNumber: 10}
      }))).toBeTruthy();
    });

    it ('run is after main run', () => {
      expect(scoreDifference.isOverlappingWith(new ScoreDifference({
        startAction: {actionNumber: 16},
        endAction: {actionNumber: 26}
      }))).toBeFalsy();
    });

    it ('run is before main run', () => {
      expect(scoreDifference.isOverlappingWith(new ScoreDifference({
        startAction: {actionNumber: 1},
        endAction: {actionNumber: 4}
      }))).toBeFalsy();
    });

    it ('run ends on the start of the main run', () => {
      expect(scoreDifference.isOverlappingWith(new ScoreDifference({
        startAction: {actionNumber: 2},
        endAction: {actionNumber: 5}
      }))).toBeFalsy();
    });

    it ('run starts at the end of the main run', () => {
      expect(scoreDifference.isOverlappingWith(new ScoreDifference({
        startAction: {actionNumber: 15},
        endAction: {actionNumber: 20}
      }))).toBeFalsy();
    });
  });

  describe('setting of runDurationDisplay', () => {
    it('sets the duration display correctly', () => {
      expect(new ScoreDifference({durationInSeconds: 55}).runDurationDisplay).toEqual('0:55')
      expect(new ScoreDifference({durationInSeconds: 64}).runDurationDisplay).toEqual('1:04')
    })
  });
})
