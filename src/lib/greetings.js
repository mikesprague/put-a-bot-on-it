import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { LocalStorage } from 'node-localstorage';

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

import { birdLog, getRandomGifByTerm } from './helpers.js';

export const initGreetingGif = async ({
  discordClient,
  gifSearchTerm,
  storageKey,
  greetingHour,
  greetingMinute = 0,
  greetingDay = '*',
  excludeDay = null,
  sendToChannel = '756162896634970113',
  sendToUser = null,
}) => {
  const localStorage = new LocalStorage('/local-storage');
  const greetingSent = localStorage.getItem(storageKey);
  const now = dayjs().tz(defaultTimezone);
  const currentHour = now.get('hour');
  const currentMinute = now.get('minute');
  const currentDay = now.get('day');
  const searchTerm =
    gifSearchTerm === 'morning greeting'
      ? now.format('dddd').toLowerCase()
      : gifSearchTerm;
  if (
    (greetingDay === '*' && currentDay !== excludeDay) ||
    currentDay === greetingDay
  ) {
    if (
      !greetingSent &&
      currentHour === greetingHour &&
      currentMinute >= greetingMinute
    ) {
      const gif = await getRandomGifByTerm(searchTerm, false);
      if (sendToUser) {
        discordClient.users.cache.get(sendToUser).send({ content: gif });
      }
      if (sendToChannel) {
        discordClient.channels.cache.get(sendToChannel).send({ content: gif });
      }
      birdLog(`[initGreetingGif] ${gif}`);
      localStorage.setItem(storageKey, true);
    }
    if (
      greetingSent &&
      currentHour > greetingHour &&
      currentMinute > greetingMinute
    ) {
      localStorage.removeItem(storageKey);
      birdLog(`[initGreetingGif] cleaned up ${storageKey}`);
    }
  }
};

export const initAllGifGreetings = (client) => {
  setInterval(async () => {
    await initGreetingGif({
      discordClient: client,
      gifSearchTerm: 'morning greeting',
      storageKey: 'greetingSent',
      greetingHour: 8,
      greetingDay: '*',
      excludeDay: 5,
    });
    await initGreetingGif({
      discordClient: client,
      gifSearchTerm: 'tgif',
      storageKey: 'greetingSent',
      greetingHour: 8,
      greetingDay: 5,
    });
    await initGreetingGif({
      discordClient: client,
      gifSearchTerm: 'happy hour',
      storageKey: 'happyHourSent',
      greetingHour: 16,
      greetingMinute: 58,
      greetingDay: '*',
      excludeDay: 5,
    });
    await initGreetingGif({
      discordClient: client,
      gifSearchTerm: 'happy hour',
      storageKey: 'happyHourSent',
      greetingHour: 16,
      greetingDay: 5,
    });
    await initGreetingGif({
      discordClient: client,
      gifSearchTerm: '420',
      storageKey: 'fourTwentySent',
      greetingHour: 16,
      greetingMinute: 20,
    });
  }, 60000);
};
