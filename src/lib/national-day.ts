import { birdLog } from './helpers.ts';

export const initNationalDayData = async (): Promise<
  Array<{ title: string; description: string; link: string }>
> => {
  birdLog('[initNationalDayData] Fetching National Day data from API');
  const apiResults = await fetch(
    'https://mikesprague.github.io/api/national-day/'
  )
    .then((response) => response.json())
    .catch((error) => birdLog('[national-day] Error: \n', error));

  return (
    apiResults as {
      data: Array<{ title: string; description: string; link: string }>;
    }
  ).data;
};
