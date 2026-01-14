import { rando } from '@nastyox/rando.js';
import Discord, { MessageFlags } from 'discord.js';
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
  for (const word of wordsArray) {
    if (!wordMatched && messageIncludesWord(message, word)) {
      wordMatched = true;
    }
  }
  return wordMatched;
};

export const makeApiCall = async (
  apiEndpoint,
  requestMethod = 'GET',
  requestHeaders = null,
  requestBody = null
) => {
  const fetchConfig = {
    method: requestMethod,
  };
  if (
    (requestMethod.toUpperCase() === 'POST' ||
      requestMethod.toUpperCase() === 'PUT') &&
    requestBody
  ) {
    fetchConfig.body = requestBody;
  }
  if (requestHeaders) {
    fetchConfig.headers = {
      ...requestHeaders,
    };
  }
  const apiData = await fetch(apiEndpoint, fetchConfig).then((response) =>
    response.json()
  );

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
  birdLog(`[getGiphyGifs] ${encodedSearchTerm}`);
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
  const { KLIPY_API_KEY } = process.env;
  birdLog(`[getTenorGifs] ${encodedSearchTerm}`);
  const apiUrl = urls.tenorApiSearch({
    apiKey: KLIPY_API_KEY,
    searchTerm: encodedSearchTerm,
  });
  const remoteData = await makeApiCall(apiUrl);
  if (remoteData?.results.length) {
    return remoteData.results;
  }
  const backupSearchTerm = encodeURIComponent('swedish chef');
  const backupApiUrl = urls.tenorApiSearch({
    apiKey: KLIPY_API_KEY,
    searchTerm: backupSearchTerm,
  });
  const backupData = await makeApiCall(backupApiUrl);
  return backupData.results;
};

export const registerTenorGifShare = async (tenorGifObject, searchTerm) => {
  const { KLIPY_API_KEY } = process.env;
  const apiShareUrl = urls.tenorApiShare({
    apiKey: KLIPY_API_KEY,
    gifId: tenorGifObject.id,
    searchTerm: encodeURIComponent(searchTerm),
  });
  // console.log(apiShareUrl);
  await makeApiCall(apiShareUrl);
};

export const getRandomGifByTerm = async (searchTerm, useDownsized = true) => {
  // const gifs = await getGiphyGifs({ searchTerm });
  const gifs = await getTenorGifs({ searchTerm });
  const randomNum = getRandomNum(gifs.length);
  // return useDownsized
  //   ? gifs[randomNum].images.downsized.url
  //   : gifs[randomNum].images.original.url;
  return useDownsized
    ? gifs[randomNum].media_formats.gif.url
    : gifs[randomNum].media_formats.gif.url;
};

export const prepareEmbed = ({
  embedAuthor = { name: '' },
  embedTitle = '',
  embedDescription = '',
  embedImage = '',
  embedThumbnail = '',
  embedColor = '',
  embedUrl = '',
  embedFooter = '',
}) => {
  const discordEmbed = new Discord.EmbedBuilder();

  if (embedAuthor.name.trim().length) {
    discordEmbed.setAuthor(embedAuthor);
  }
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

export const sendContent = async ({
  interaction,
  content,
  reaction = null,
  ttl = null,
  deferred = false,
  ephemeral = false,
}) => {
  try {
    if (deferred) {
      await interaction.editReply({
        content,
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
      });
    } else {
      await interaction.reply({
        content,
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
      });
    }
    if (reaction) {
      const message = await interaction.fetchReply();
      message.react(reaction);
      if (ttl) {
        setTimeout(async () => {
          await message.delete();
        }, ttl);
      }
    }
  } catch (error) {
    birdLog('[sendContent] 💀 Error: \n', error);
  }
};

export const sendEmbed = async ({
  interaction,
  content,
  file = null,
  reaction = null,
  ttl = null,
  deferred = true,
  ephemeral = false,
}) => {
  try {
    if (deferred) {
      await interaction.editReply({
        embeds: [content],
        files: file ? [file] : null,
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
      });
    } else {
      await interaction.reply({
        embeds: [content],
        files: file ? [file] : null,
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
      });
    }
    if (reaction) {
      const message = await interaction.fetchReply();
      if (typeof reaction === 'object') {
        for await (const emoji of reaction) {
          message.react(emoji);
        }
      } else {
        message.react(reaction);
      }
      if (ttl) {
        setTimeout(async () => {
          await message.delete();
        }, ttl);
      }
    }
  } catch (error) {
    birdLog('[sendEmbed] 💀 Error: \n', error);
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
    (item1, item2) => item1[key].toLowerCase() - item2[key].toLowerCase()
  );
