const axios = require('axios').default;
const { rando } = require('@nastyox/rando.js');

const { birdEmojis } = require('./word-lists');

exports.birdLog = (content) => console.log('🐦💬 ', content);

exports.getRandomNum = (maxValue) => rando(maxValue - 1);

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

exports.makeApiCall = async (
  apiEndpoint,
  requestMethod = 'GET',
  requestHeaders = null,
  requestBody = null,
) => {
  const axiosConfig = {};
  if (
    (requestMethod.toUpperCase() === 'POST' ||
      requestMethod.toUpperCase() === 'PUT') &&
    requestBody
  ) {
    axiosConfig.data = requestBody;
    // console.log('requestBody: ', requestBody);
  }
  if (requestHeaders) {
    axiosConfig.headers = {
      ...requestHeaders,
    };
  }
  const apiData = await axios({
    url: `${apiEndpoint}`,
    method: `${requestMethod}`,
    ...axiosConfig,
  })
    .then((response) => response.data)
    .catch((error) => console.error(error));
  return apiData;
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
  const remoteData = await exports.makeApiCall(
    'https://icanhazdadjoke.com/',
    'GET',
    {
      Accept: 'application/json',
    },
  );
  return remoteData.joke;
};

exports.getTrackingInfo = async (trackingId) => {
  const remoteData = await exports.makeApiCall(
    `https://package.place/api/track/${trackingId}?stream=true`,
  );
  return remoteData;
};

exports.getGifs = async (searchTerm) => {
  const numGifs = 50;
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const { GIPHY_API_KEY } = process.env;
  exports.birdLog(encodedSearchTerm);
  const remoteData = await exports.makeApiCall(
    `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodedSearchTerm}&limit=${numGifs}&offset=0&rating=r&lang=en`,
  );
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
  const xkcdData = await exports.makeApiCall(xkcdUrl);
  return xkcdData;
};

exports.getKanye = async () => {
  const kanyeData = await exports.makeApiCall('https://api.kanye.rest/');
  return kanyeData;
};

exports.getCatFact = async () => {
  const catFactsData = await exports.makeApiCall(
    'https://cat-fact.herokuapp.com/facts/random?amount=50',
  );
  return catFactsData;
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

exports.getNasa = async (random = false) => {
  const { NASA_API_KEY } = process.env;
  const apiURLBase = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
  const apiUrlSuffix = random ? '&count=50' : '';
  const nasaData = await exports.makeApiCall(`${apiURLBase}${apiUrlSuffix}`);
  const randomNum = exports.getRandomNum(nasaData.length);
  return random ? nasaData[randomNum] : nasaData;
};

exports.getAdvice = async () => {
  const adviceData = await exports.makeApiCall(
    'https://api.adviceslip.com/advice',
  );
  return adviceData;
};
