import * as cron from 'node-cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

import { birdLog, getRandomGifByTerm } from './helpers.js';

export const initGreetingGif = async ({
  discordClient,
  gifSearchTerm,
  cronExpression,
  sendToChannel = '756162896634970113',
  sendToUser = null,
}) => {
  cron.schedule(
    cronExpression,
    async () => {
      const gif = await getRandomGifByTerm(gifSearchTerm, false);
      if (sendToUser) {
        discordClient.users.cache.get(sendToUser).send({ content: gif });
      }
      if (sendToChannel) {
        discordClient.channels.cache.get(sendToChannel).send({ content: gif });
      }
      birdLog(`[initGreetingGif] ${gif}`);
    },
    { timezone: defaultTimezone },
  );
  birdLog(`[cron] job scheduled with expression: ${cronExpression}`);
};

export const initAllGifGreetings = async (client) => {
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: dayjs().tz(defaultTimezone).format('dddd').toLowerCase(),
    cronExpression: '0 8 * * 0-4,6',
  });
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: 'tgif',
    cronExpression: '0 8 * * 5',
  });
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: 'happy hour',
    cronExpression: '58 16 * * 0-4,6',
  });
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: 'happy hour',
    cronExpression: '0 16 * * 5',
  });
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: '420',
    cronExpression: '20 16 * * *',
  });
};
