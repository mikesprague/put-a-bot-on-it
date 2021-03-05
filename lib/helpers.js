const axios = require('axios').default;

const { birdEmojis } = require('./word-lists');

exports.birdLog = (content) => console.log('🐦💬 ', content);

exports.getRandomNum = (maxValue) => Math.floor(Math.random() * (maxValue - 1));

exports.normalizeMsgContent = (msg) => msg.content.toLowerCase();

exports.messageMatchesWord = (message, word) =>
  word.includes(exports.normalizeMsgContent(message));

exports.messageIncludesWord = (message, word) =>
  exports.normalizeMsgContent(message).includes(word);

exports.messageIncludesWords = (message, wordsArray) => {
  let wordMatched = false;
  wordsArray.forEach((word) => {
    if (!wordMatched && exports.messageIncludesWord(message, word)) {
      wordMatched = true;
    }
  });
  return wordMatched;
};

exports.getRandomBirdEmoji = () => {
  const randomBird = exports.getRandomNum(birdEmojis.length);
  // eslint-disable-next-line security/detect-object-injection
  return birdEmojis[randomBird];
};

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
  // eslint-disable-next-line security/detect-object-injection
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
  // eslint-disable-next-line security/detect-object-injection
  return gifs[randomNum].images.original.url;
};

exports.getXkcd = async (random = false) => {
  const randumComicNum = () => exports.getRandomNum(2430) + 1;
  const xkcdUrl = random
    ? `https://xkcd.com/${randumComicNum()}/info.0.json`
    : 'https://xkcd.com/info.0.json';
  const xkcdData = await axios.get(xkcdUrl).then((response) => response.data);
  return xkcdData;
};

exports.getSteve = async (term = '') => {
  const searchTerm = term.trim().length
    ? `steve harvey ${term}`
    : 'steve harvey';
  const steveGifs = await exports.getGifs(searchTerm);
  const randomNum = term.trim().length
    ? exports.getRandomNum(steveGifs.length > 10 ? 10 : steveGifs.length)
    : exports.getRandomNum(steveGifs.length);
  // eslint-disable-next-line security/detect-object-injection
  return steveGifs[randomNum].images.original.url;
};
