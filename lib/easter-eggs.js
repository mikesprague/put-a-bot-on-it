const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { LocalStorage } = require('node-localstorage');

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

const { prefix } = require('../config.json');

const {
  birdLog,
  getRandomGifByTerm,
  normalizeMsgContent,
  messageIncludesWords,
} = require('./helpers');

const {
  insultStrings,
} = require('./lists');

const initMiddleFinger = async (msg) => {
  if (msg.author.bot || msg.content.startsWith(prefix)) return;
  if (insultStrings.includes(normalizeMsgContent(msg))) {
    const middleFInger = await getRandomGifByTerm('middle finger', false);
    msg.channel.send(middleFInger);
  }
};

const initCate = (msg) => {
  if (msg.author.bot || msg.content.startsWith(prefix)) return;
  const cateWords = ['architect', 'toilet beam'];
  if (messageIncludesWords(msg, cateWords)) {
    msg.channel.send(
      'https://giphy.com/gifs/funny-work-architect-CbSGut2wzWKZy',
    );
  }
};

exports.initEasterEggs = async (msg) => {
  await initMiddleFinger(msg);
  initCate(msg);
};

exports.initGreetingGif = async ({
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
  const localStorage = new LocalStorage('./local-storage');
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
        discordClient.users.cache.get(sendToUser).send(gif);
      }
      if (sendToChannel) {
        discordClient.channels.cache.get(sendToChannel).send(gif);
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
