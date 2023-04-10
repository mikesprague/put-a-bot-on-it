import axios from 'axios';

import { birdLog } from './helpers.js';

export const initNationalDayData = async () => {  
    birdLog(
      `[initNationalDayData] Fetching National Day data from API`,
    );
    const apiResults = await axios('https://mikesprague.github.io/api/national-day/')
      .then(async (response) => response.data)
      .catch((error) => birdLog(`[national-day] Error: \n`, error));

  return apiResults.data;
};
