import { TheScoreEvent, TVListing } from './model';
import * as dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/advancedFormat'));
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
export class TheScoreEventAnalyzer {
  private theScoreEvent: TheScoreEvent;

  constructor(theScoreEvent: TheScoreEvent) {
    this.theScoreEvent = theScoreEvent;
  }

  getTvListingsForDisplay() {
    let tvListings: TVListing[] = [];
    if (
      this.theScoreEvent.tv_listings_by_country_code &&
      this.theScoreEvent.tv_listings_by_country_code.ca
    ) {
      tvListings = tvListings.concat(this.theScoreEvent.tv_listings_by_country_code.ca);
    }
    if (this.theScoreEvent.tv_listings_by_country_code && this.theScoreEvent.tv_listings_by_country_code.us) {
      tvListings = tvListings.concat(this.theScoreEvent.tv_listings_by_country_code.us);
    }
    if (tvListings.length === 0) {
      return null;
    } else {
      return tvListings.map((tv) => tv.short_name).join(', ');
    }
  }

  getGameTime() {
    const parsed = Date.parse(this.theScoreEvent.game_date);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dayjs.tz(dayjs(parsed), 'America/Toronto');
    return dayjs(parsed).format('ddd MMM D, h:mm A z');
  }
}
