export function consolidatePlayerLineups(playerLineups) {

  let i = 0;
  let j = 1;
    while (i < playerLineups.length && j < playerLineups.length) {
      if (playerLineups[i].inLineup === playerLineups[j].inLineup) {
         playerLineups[i].duration += playerLineups[j].duration;
         playerLineups[j].duration = 0;
         if (playerLineups[i].inLineup) {
           playerLineups[i].lineupStats.add(playerLineups[j].lineupStats);
         }

        j++;
      } else {
        i = j;
        j = i + 1;
      }
    }
  return playerLineups;
}

export function consolidateMultiplePlayerLineups(multiplePlayerLineups) {
  const transposed = multiplePlayerLineups[0].map((_, colIndex) => multiplePlayerLineups.map(row => row[colIndex]));
  const result = [];
  transposed.forEach((value, index) => {
    result.push(consolidatePlayerLineups(value));
  });
  return result[0].map((_, colIndex) => result.map(row => row[colIndex]));
}
