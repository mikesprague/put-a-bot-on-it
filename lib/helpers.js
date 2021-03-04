const axios = require('axios').default;
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { LocalStorage } = require('node-localstorage');

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

exports.birdLog = (content) => console.log('🐦💬 ', content);

exports.getRandomNum = (maxValue) => Math.floor(Math.random() * (maxValue - 1));

exports.normalizeMsgContent = (msg) => msg.content.toLowerCase();

exports.getCustomEmojiCode = (emojiName) => {
  const customEmoji = {
    steve: '804812816287793192',
    wutang: '755775997646733492',
    trumphair: '755775997256925276',
    putin: '755775997579886683',
    farthing: '755775997479092225',
    ohyeah: '776464496436051969',
    clippy: '756184777664495626',
  };
  return customEmoji[emojiName];
};

exports.getDadJoke = async () => {
  const remoteData = await axios
    .get('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json',
      },
    })
    .then((response) => response.data);
  return remoteData.joke;
};

exports.getTrackingInfo = async (trackingId) => {
  const remoteData = await axios
    .get(`https://package.place/api/track/${trackingId}?stream=true`)
    .then((response) => response.data);
  return remoteData;
};

exports.getGifs = async (searchTerm) => {
  const numGifs = 50;
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const { GIPHY_API_KEY } = process.env;
  exports.birdLog(encodedSearchTerm);
  const remoteData = await axios
    .get(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodedSearchTerm}&limit=${numGifs}&offset=0&rating=r&lang=en`,
    )
    .then((response) => response.data);
  return remoteData.data;
};

exports.getRandomGifByTerm = async (searchTerm) => {
  const gifs = await exports.getGifs(searchTerm);
  const randomNum = exports.getRandomNum(gifs.length);
  return gifs[randomNum].images.original.url;
};

exports.getSteve = async (term = '') => {
  const searchTerm = term.trim().length
    ? `steve harvey ${term}`
    : 'steve harvey';
  const steveGifs = await exports.getGifs(searchTerm);
  const randomNum = term.trim().length
    ? exports.getRandomNum(steveGifs.length > 10 ? 10 : steveGifs.length)
    : exports.getRandomNum(steveGifs.length);
  return steveGifs[randomNum].images.original.url;
};

exports.initGreetingGif = async (
  discordClient,
  gifSearchTerm,
  storageKey,
  greetingHour,
  greetingDay = '*',
  excludeDay = null,
) => {
  const localStorage = new LocalStorage('local-storage');
  const everyoneChannel = '756162896634970113';
  const greetingSent = localStorage.getItem(storageKey);
  const now = dayjs().tz(defaultTimezone);
  const currentHour = now.get('hour');
  const currentDay = now.get('day');
  if (
    (greetingDay === '*' && currentDay !== excludeDay) ||
    currentDay === greetingDay
  ) {
    if (!greetingSent && currentHour === greetingHour) {
      const gif = await exports.getRandomGifByTerm(gifSearchTerm);
      discordClient.channels.cache.get(everyoneChannel).send(gif);
      exports.birdLog(gif);
      localStorage.setItem(storageKey, true);
    }
    if (currentHour > greetingHour && greetingSent) {
      localStorage.removeItem(storageKey);
    }
  }
};
