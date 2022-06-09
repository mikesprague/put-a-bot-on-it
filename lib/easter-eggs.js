import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { LocalStorage } from 'node-localstorage';

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

import {
  birdLog,
  getRandomGifByTerm,
  normalizeMsgContent,
  messageIncludesWords,
} from './helpers.js';
import { insultStrings } from './lists.js';

const initMiddleFinger = async (msg) => {
  if (msg.author.bot) {
    return;
  }
  if (insultStrings.includes(normalizeMsgContent(msg))) {
    const middleFInger = await getRandomGifByTerm('middle finger', false);
    msg.channel.send({ content: middleFInger });
  }
};

const initCate = (msg) => {
  if (msg.author.bot) {
    return;
  }
  const cateWords = ['architect', 'toilet beam'];
  if (messageIncludesWords(msg, cateWords)) {
    msg.channel.send({
      content: 'https://giphy.com/gifs/funny-work-architect-CbSGut2wzWKZy',
    });
  }
};

const initBurger = (msg) => {
  if (msg.author.bot) {
    return;
  }
  const burgerWords = ['five guys', 'fat guys', 'burger'];
  if (messageIncludesWords(msg, burgerWords)) {
    msg.channel.send({
      content: 'https://tenor.com/MDyi.gif',
    });
  }
};

export const initEasterEggs = async (msg) => {
  await initMiddleFinger(msg);
  initCate(msg);
  initBurger(msg);
};

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
      birdLog(gif);
      localStorage.setItem(storageKey, true);
    }
    if (
      greetingSent &&
      currentHour > greetingHour &&
      currentMinute > greetingMinute
    ) {
      localStorage.removeItem(storageKey);
      birdLog(`cleaned up ${storageKey}`);
    }
  }
};
