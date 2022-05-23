import Discord from 'discord.js';
import axios from 'axios';
import { rando } from '@nastyox/rando.js';
import randomColor from 'randomcolor';

import { birdEmojis, customEmoji } from './lists.js';
import * as urls from './urls.js';

export const birdLog = (...content) => console.log('🐦💬 ', ...content);

export const getRandomNum = (maxValue) => Number(rando(0, maxValue - 1));

export const getRandomColor = (options = {}) =>
  options.length ? randomColor(options) : randomColor();

export const normalizeMsgContent = (msg) => msg.content.toLowerCase().trim();

export const messageMatchesWord = (message, word) =>
  word.includes(normalizeMsgContent(message));

export const messageIncludesWord = (message, word) =>
  normalizeMsgContent(message).includes(word);

export const messageIncludesWords = (message, wordsArray) => {
  let wordMatched = false;
  wordsArray.forEach((word) => {
    if (!wordMatched && messageIncludesWord(message, word)) {
      wordMatched = true;
    }
  });
  return wordMatched;
};

export const makeApiCall = async (
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

export const getRandomBirdEmoji = () => {
  const randomBird = getRandomNum(birdEmojis.length);
  return birdEmojis[randomBird];
};

export const getCustomEmojiCode = (emojiName) => customEmoji[emojiName.trim()];

export const getGiphyGifs = async ({ searchTerm, stickerSearch = false }) => {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const { GIPHY_API_KEY } = process.env;
  birdLog(encodedSearchTerm);
  const apiUrl = urls.giphyApi({
    apiKey: GIPHY_API_KEY,
    searchTerm: encodedSearchTerm,
    stickerSearch,
  });
  const remoteData = await makeApiCall(apiUrl);
  return remoteData.data;
};

export const getTenorGifs = async ({ searchTerm }) => {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const { TENOR_API_KEY } = process.env;
  birdLog(encodedSearchTerm);
  const apiUrl = urls.tenorApiSearch({
    apiKey: TENOR_API_KEY,
    searchTerm: encodedSearchTerm,
  });
  const remoteData = await makeApiCall(apiUrl);
  if (remoteData.results && remoteData.results.length) {
    return remoteData.results;
  }
  const backupSearchTerm = encodeURIComponent('swedish chef');
  const backupApiUrl = urls.tenorApiSearch({
    apiKey: TENOR_API_KEY,
    searchTerm: backupSearchTerm,
  });
  const backupData = await makeApiCall(backupApiUrl);
  return backupData.results;
};

export const registerTenorGifShare = async (tenorGifObject, searchTerm) => {
  const { TENOR_API_KEY } = process.env;
  const apiShareUrl = urls.tenorApiShare({
    apiKey: TENOR_API_KEY,
    gifId: tenorGifObject.id,
    searchTerm: encodeURIComponent(searchTerm),
  });
  // console.log(apiShareUrl);
  const registerShare = await makeApiCall(apiShareUrl);
  // console.log(registerShare);
};

export const getRandomGifByTerm = async (searchTerm, useDownsized = true) => {
  // const gifs = await getGiphyGifs({ searchTerm });
  const gifs = await getTenorGifs({ searchTerm });
  const randomNum = getRandomNum(gifs.length);
  // return useDownsized
  //   ? gifs[randomNum].images.downsized.url
  //   : gifs[randomNum].images.original.url;
  return useDownsized
    ? gifs[randomNum].media[0].gif.url
    : gifs[randomNum].media[0].gif.url;
};

export const prepareEmbed = ({
  embedTitle = '',
  embedDescription = '',
  embedImage = '',
  embedThumbnail = '',
  embedColor = '',
  embedUrl = '',
  embedFooter = '',
}) => {
  const discordEmbed = new Discord.MessageEmbed();

  if (embedColor.trim().length) {
    discordEmbed.setColor(embedColor);
  }
  if (embedTitle.trim().length) {
    discordEmbed.setTitle(embedTitle);
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
    discordEmbed.setFooter({ text: embedFooter });
  }

  return discordEmbed;
};

export const sendContent = async (interaction, content, reaction = null) => {
  try {
    await interaction.reply({ content });
    if (reaction) {
      const message = await interaction.fetchReply();
      await message.react(reaction);
    }
  } catch (error) {
    console.error('💀 There was an error executing sendContent: \n', error);
  }
};

export const sendEmbed = async (interaction, content, reaction = null) => {
  try {
    await interaction.reply({ embeds: [content] });
    if (reaction) {
      const message = await interaction.fetchReply();
      await message.react(reaction);
    }
  } catch (error) {
    console.error('💀 There was an error executing sendEmbed: \n', error);
  }
};

export const wait = async (delay = 0) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const filterArrayOfObjects = (array, field, value) =>
  array.filter((item) => {
    return item[field].trim().toLowerCase() === value.trim().toLowerCase();
  });

export const sortArrayOfObjects = (arrayToSort, key) =>
  arrayToSort.sort(
    (item1, item2) => item1[key].toLowerCase() - item2[key].toLowerCase(),
  );
