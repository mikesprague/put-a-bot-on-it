const Discord = require('discord.js');
const axios = require('axios').default;
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { rando } = require('@nastyox/rando.js');
const randomColor = require('randomcolor');

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

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
  return birdEmojis[Number(randomBird)];
};

exports.getCustomEmojiCode = (emojiName) => customEmoji[emojiName.trim()];

exports.getGifs = async ({ searchTerm, stickerSearch = false }) => {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const { GIPHY_API_KEY } = process.env;
  exports.birdLog(encodedSearchTerm);
  const apiUrl = urls.giphyApi({
    apiKey: GIPHY_API_KEY,
    searchTerm: encodedSearchTerm,
    stickerSearch,
  });
  const remoteData = await exports.makeApiCall(apiUrl);
  return remoteData.data;
};

exports.getRandomGifByTerm = async (searchTerm, useDownsized = true) => {
  const gifs = await exports.getGifs({ searchTerm });
  const randomNum = exports.getRandomNum(gifs.length);
  return useDownsized
    ? gifs[Number(randomNum)].images.downsized.url
    : gifs[Number(randomNum)].images.original.url;
};

exports.prepareEmbed = ({
  command,
  msg,
  embedTtitle = '',
  embedDescription = '',
  embedImage = '',
  embedThumbnail = '',
  embedColor = '',
  embedUrl = '',
  embedFooter = '',
}) => {
  const discordEmbed = new Discord.MessageEmbed();
  const authorText = `${msg.author.username} ?${command}`;
  const authorAvatar = msg.author.displayAvatarURL();

  if (embedColor.trim().length) {
    discordEmbed.setColor(embedColor);
  }
  if (embedTtitle.trim().length) {
    discordEmbed.setTitle(embedTtitle);
  }
  if (embedDescription.trim().length) {
    discordEmbed.setDescription(embedDescription);
  }
  if (embedThumbnail.trim().length) {
    discordEmbed.setThumbnail(embedThumbnail);
  }
  if (embedImage.trim().length) {
    discordEmbed.setImage(embedImage);
  }
  if (embedUrl.trim().length) {
    discordEmbed.setURL(embedUrl);
  }
  if (embedFooter.trim().length) {
    discordEmbed.setFooter(embedFooter);
  }
  discordEmbed.setAuthor(authorText, authorAvatar);

  return discordEmbed;
};

exports.sendContent = (msg, content, deleteMsg = true) => {
  msg.channel.send(content).then(() => {
    if (!deleteMsg) return;
    msg.delete();
  });
};
