import { Action, PlayerGraphLineup, PlayerStats, TeamStats } from './model';
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

function calculateUsageRate(lineupStats: PlayerStats, teamStats: TeamStats): number {
  const usage = ((lineupStats.fga2 + lineupStats.fga3 + lineupStats.turnovers) + .44*lineupStats.fta) / teamStats.totalOffensivePossessions;
  const percentage = usage * 100;
  return Math.round(percentage * 10) / 10;
}

function explainUsageRate(actions: Action[], lineupStats: PlayerStats, teamStats: TeamStats) {
  return `<b>Usage Rate:</b> ${calculateUsageRate(lineupStats, teamStats)}%<br>` +
      `3FGA: ${lineupStats.fga3}<br>` +
      `2FGA: ${lineupStats.fga2}<br>` +
      `FTA: ${lineupStats.fta}<br>` +
      `TO: ${lineupStats.turnovers}<br>` +
      `Team Possessions: ${Math.round(teamStats.totalOffensivePossessions)}<br><br>` +
      `${formatActions(actions)}`;
}

function usageRateAlpha(lineupStats: PlayerStats, teamStats: TeamStats) {
  if (!lineupStats) {
    return 0;
  }
  const usageRate = calculateUsageRate(lineupStats, teamStats);
  let alpha = 0;
  if (usageRate < 16) {
    alpha = 0.20;
  } else if (usageRate >= 16 && usageRate < 20) {
    alpha = 0.55;
  } else if (usageRate >= 20 && usageRate < 24) {
    alpha = 0.75;
  } else {
    alpha = 1;
  }
  return alpha;
}

function unloadAndFormatSingle(playerGraphLineup: PlayerGraphLineup[]): PlayerGraphLineup[] {
  return playerGraphLineup.map(pgl => new PlayerGraphLineup({
    ...pgl,
    actions: [],
    plusMinusDetail: formatDetail(pgl),
    plusMinusLabel: `${secondsToDuration(pgl.duration)}, ${addSign(pgl.plusMinus)}`,
    usageDetail: pgl.lineupStats ? explainUsageRate(pgl.actions, pgl.lineupStats, pgl.teamStats) : "",
    usageLabel: pgl.lineupStats ? `${calculateUsageRate(pgl.lineupStats, pgl.teamStats)}%` : "",
    usageRateAlphaColor: usageRateAlpha(pgl.lineupStats, pgl.teamStats)
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
