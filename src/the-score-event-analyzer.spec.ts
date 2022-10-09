import { TheScoreEvent } from './model';
import { TheScoreEventAnalyzer } from './the-score-event-analyzer';
const fs = require('fs');

describe('TheScoreEvent', () => {
  let theScoreEventAnalyzer: TheScoreEventAnalyzer;
  beforeEach(() => {});
  it('gets TV listings as a string', () => {
    const event: TheScoreEvent = JSON.parse(
      fs.readFileSync(`./testdata/the-score-event.json`),
    );
    theScoreEventAnalyzer = new TheScoreEventAnalyzer(event);
    const result = theScoreEventAnalyzer.getTvListingsForDisplay();
    expect(result).toEqual('SN360, NBA TV, Sportsnet, NBCS-CHI');
  });
  it('when no tv listings present, return empty string', () => {
    const event: TheScoreEvent = JSON.parse(
      fs.readFileSync(`./testdata/the-score-event.json`),
    );
    event.tv_listings_by_country_code = null;
    theScoreEventAnalyzer = new TheScoreEventAnalyzer(event);
    const result = theScoreEventAnalyzer.getTvListingsForDisplay();
    expect(result).toBeNull();
  });

  it('when only one TV listing present', () => {
    const event: TheScoreEvent = JSON.parse(
      fs.readFileSync(`./testdata/the-score-event.json`),
    );
    event.tv_listings_by_country_code.us = null;
    theScoreEventAnalyzer = new TheScoreEventAnalyzer(event);
    const result = theScoreEventAnalyzer.getTvListingsForDisplay();
    expect(result).toEqual('SN360');
  });

  it ('shows the game date as 6pm on Mon Oct 9', () => {
    const event: TheScoreEvent = JSON.parse(
      fs.readFileSync(`./testdata/the-score-event.json`),
    );
    theScoreEventAnalyzer = new TheScoreEventAnalyzer(event);
    expect(theScoreEventAnalyzer.getGameTime()).toEqual('Sun Oct 9, 6:00 PM EDT')
  });
});
