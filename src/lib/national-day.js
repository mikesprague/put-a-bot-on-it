import { birdLog } from './helpers.js';

export const initNationalDayData = async () => {
  birdLog('[initNationalDayData] Fetching National Day data from API');
  const apiResults = await fetch(
    'https://mikesprague.github.io/api/national-day/'
  )
    .then((response) => response.json())
    .catch((error) => birdLog('[national-day] Error: \n', error));

  return apiResults.data;
};
