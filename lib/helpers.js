const axios = require('axios').default;
const { rando } = require('@nastyox/rando.js');
const randomColor = require('randomcolor');

const { birdEmojis, customEmoji } = require('./lists');
const urls = require('./urls');

exports.birdLog = (...content) => console.log('🐦💬 ', ...content);

exports.getRandomNum = (maxValue) => rando(maxValue - 1);

exports.getRandomColor = (options = {}) =>
  options.length ? randomColor(options) : randomColor();

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
  }).then((response) => response.data);
  return apiData;
};

exports.getRandomBirdEmoji = () => {
  const randomBird = exports.getRandomNum(birdEmojis.length);
  // eslint-disable-next-line security/detect-object-injection
  return birdEmojis[randomBird];
};

// eslint-disable-next-line security/detect-object-injection
exports.getCustomEmojiCode = (emojiName) => customEmoji[emojiName];

exports.getGifs = async (searchTerm) => {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const { GIPHY_API_KEY } = process.env;
  exports.birdLog(encodedSearchTerm);
  const apiUrl = urls.giphyApi(GIPHY_API_KEY, encodedSearchTerm);
  const remoteData = await exports.makeApiCall(apiUrl);
  return remoteData.data;
};

exports.getRandomGifByTerm = async (searchTerm) => {
  const gifs = await exports.getGifs(searchTerm);
  const randomNum = exports.getRandomNum(gifs.length);
  // eslint-disable-next-line security/detect-object-injection
  return gifs[randomNum].images.original.url;
};
