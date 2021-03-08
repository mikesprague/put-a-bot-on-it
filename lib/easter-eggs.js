const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { LocalStorage } = require('node-localstorage');

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

const {
  birdLog,
  getRandomBirdEmoji,
  getCustomEmojiCode,
  getRandomGifByTerm,
  normalizeMsgContent,
  messageMatchesWord,
  messageIncludesWord,
  messageIncludesWords,
} = require('./helpers');

const {
  birdSynonyms,
  greetings,
  insultStrings,
  poopStrings,
  rtjStrings,
} = require('./lists');

const initBird = async (msg) => {
  if (msg.author.bot) return;
  if (messageIncludesWords(msg, birdSynonyms)) {
    const randomBird = getRandomBirdEmoji();
    await msg.react(randomBird);
  }
};

const initTrumpPutin = async (msg) => {
  if (msg.author.bot) return;

  if (
    messageIncludesWord(msg, 'trump') &&
    !messageIncludesWord(msg, 'trumpet')
  ) {
    const trumpEmoji = getCustomEmojiCode('trumphair');
    await msg.react(trumpEmoji);
  }

  if (messageIncludesWord(msg, 'putin') || messageIncludesWord(msg, 'russia')) {
    const putinEmoji = getCustomEmojiCode('putin');
    await msg.react(putinEmoji);
  }
};

const initSteve = async (msg) => {
  if (msg.author.bot) return;
  if (messageIncludesWord(msg, 'steve')) {
    const steveEmoji = getCustomEmojiCode('steve');
    await msg.react(steveEmoji);
  }
};

const initRunTheJewels = async (msg) => {
  if (msg.author.bot) return;
  if (messageIncludesWords(msg, rtjStrings)) {
    await msg.react('👉🏼');
    await msg.react('🤛🏿');
  }
};

const initGreeting = async (msg) => {
  if (msg.author.bot) return;
  if (messageMatchesWord(msg, greetings)) {
    await msg.react('👋');
  }
};

const initPoop = async (msg) => {
  const ignoreList = ['<:owlpoop:817417830110593044>'];
  if (msg.author.bot || messageMatchesWord(msg, ignoreList)) return;
  if (messageIncludesWords(msg, poopStrings)) {
    await msg.react('💩');
  }
};

const initMiddleFinger = async (msg) => {
  if (msg.author.bot) return;
  if (insultStrings.includes(normalizeMsgContent(msg))) {
    const middleFInger = await getRandomGifByTerm('middle finger');
    msg.channel.send(middleFInger);
  }
};

const initCate = (msg) => {
  if (msg.author.bot) return;
  const cateWords = ['architect', 'toilet beam'];
  if (messageIncludesWords(msg, cateWords)) {
    msg.channel.send(
      'https://giphy.com/gifs/funny-work-architect-CbSGut2wzWKZy',
    );
  }
};

exports.initEasterEggs = async (msg) => {
  await initBird(msg);
  await initPoop(msg);
  await initSteve(msg);
  await initTrumpPutin(msg);
  await initRunTheJewels(msg);
  await initMiddleFinger(msg);
  initCate(msg);
  initGreeting(msg);
};

exports.initGreetingGif = async (
  discordClient,
  gifSearchTerm,
  storageKey,
  greetingHour,
  greetingDay = '*',
  excludeDay = null,
) => {
  const localStorage = new LocalStorage('./local-storage');
  const everyoneChannel = '756162896634970113';
  const greetingSent = localStorage.getItem(storageKey);
  const now = dayjs().tz(defaultTimezone);
  const currentHour = now.get('hour');
  const currentDay = now.get('day');
  const searchTerm =
    gifSearchTerm === 'morning greeting'
      ? now.format('dddd').toLowerCase()
      : gifSearchTerm;
  if (
    (greetingDay === '*' && currentDay !== excludeDay) ||
    currentDay === greetingDay
  ) {
    if (!greetingSent && currentHour === greetingHour) {
      const gif = await getRandomGifByTerm(searchTerm);
      discordClient.channels.cache.get(everyoneChannel).send(gif);
      birdLog(gif);
      localStorage.setItem(storageKey, true);
    }
    if (currentHour > greetingHour && greetingSent) {
      localStorage.removeItem(storageKey);
      birdLog(`cleaned up ${storageKey}`);
    }
  }
};
