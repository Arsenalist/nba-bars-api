import { Action, PlayerGraphLineup, PlayerStats } from './model';
import * as dayjs from 'dayjs';
import { Clock } from './clock';
dayjs.extend(require('dayjs/plugin/duration'))

export function unloadAndFormat(lineups: PlayerGraphLineup[][]): any {
  const transposed = lineups[0].map((_, colIndex) => lineups.map(row => row[colIndex]));
  const result = [];
  transposed.forEach((value) => {
    result.push(unloadAndFormatSingle(value));
  });
  return result[0].map((_, colIndex) => result.map(row => row[colIndex]));
}

function unloadAndFormatSingle(playerGraphLineup: PlayerGraphLineup[]): PlayerGraphLineup[] {
  return playerGraphLineup.map(pgl => new PlayerGraphLineup({
    ...pgl,
    actions: [],
    formattedDetail: formatDetail(pgl),
    formattedLabel: `${secondsToDuration(pgl.duration)}, ${addSign(pgl.plusMinus)}`
  }));
}


function formatDetail(pgl: PlayerGraphLineup) {
  return `<b>${pgl.player}</b><br><br><b>Stats:</b><br>${pgl.lineupStats ? pgl.lineupStats.toHtml() : ''}<br><br><b>Actions:</b><br>${formatActions(pgl.actions)}`
}

function formatActions(actions: Action[]) {
  return actions.filter(a => a.actionType !== 'substitution').map(a => {
    const time = new Clock(a.clock, a.period).displayTime();
    return `${time}: ${a.description}`
  }).join("<br>")
}

const secondsToDuration = (seconds) => {
  // @ts-ignore
  return dayjs.duration(seconds, 'seconds').format("m:ss");
}

function addSign(plusMinus: number) {
  if (plusMinus > 0) {
    return `+${plusMinus}`
  } else if (plusMinus === 0) {
    return "+/- 0"
  } else if (plusMinus < 0) {
    return `${plusMinus}`
  }
}
