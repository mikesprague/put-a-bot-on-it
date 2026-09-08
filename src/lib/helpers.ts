import { randomUUID } from 'node:crypto';

import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from 'discord.js';
import type OpenAI from 'openai';
import randomColor from 'randomcolor';

import { birdEmojis, customEmoji } from './lists.ts';
import * as urls from './urls.ts';

export const birdLog = (...content: unknown[]) =>
  console.log('🐦💬 ', ...content);

export const getRandomNum = (maxValue: number): number =>
  Math.floor(Math.random() * maxValue);

export const getRandomColor = (): string => randomColor();

export const normalizeMsgContent = (msg: { content: string }): string =>
  msg.content.toLowerCase().trim();

export const messageMatchesWord = (
  message: { content: string },
  word: string | string[]
): boolean => {
  const normalized = normalizeMsgContent(message);
  return Array.isArray(word) ? word.includes(normalized) : normalized === word;
};

export const messageIncludesWord = (
  message: { content: string },
  word: string
): boolean => normalizeMsgContent(message).includes(word);

export const messageIncludesWords = (
  message: { content: string },
  wordsArray: string[]
): boolean => {
  let wordMatched = false;
  for (const word of wordsArray) {
    if (!wordMatched && messageIncludesWord(message, word)) {
      wordMatched = true;
    }
  }
  return wordMatched;
};

export const makeApiCall = async (
  apiEndpoint: string,
  requestMethod = 'GET',
  requestHeaders: Record<string, string> | null = null,
  requestBody: unknown = null,
  timeoutMs = 10000
): Promise<unknown> => {
  const fetchConfig: {
    method: string;
    signal: AbortSignal;
    body?: unknown;
    headers?: Record<string, string>;
  } = {
    method: requestMethod,
    signal: AbortSignal.timeout(timeoutMs),
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
  const response = await fetch(apiEndpoint, fetchConfig as RequestInit);
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${response.statusText} for ${apiEndpoint}`
    );
  }
  return response.json();
};

export const getRandomBirdEmoji = (): string => {
  const randomBird = getRandomNum(birdEmojis.length);
  return birdEmojis[randomBird];
};

export const getCustomEmojiCode = (emojiName: string): string | undefined =>
  (customEmoji as Record<string, string>)[emojiName.trim()];

type KlipyGif = {
  id: string;
  file: {
    md: { gif: { url: string } };
    hd: { gif: { url: string } };
  };
};
type KlipyResponse = { data: { data: KlipyGif[] } };

export type { KlipyGif };

export const getKlipyGifs = async ({
  searchTerm,
}: {
  searchTerm: string;
}): Promise<KlipyGif[]> => {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const KLIPY_API_KEY = process.env.KLIPY_API_KEY!;
  birdLog(`[getKlipyGifs] ${encodedSearchTerm}`);
  const apiUrl = urls.klipyApiSearch({
    apiKey: KLIPY_API_KEY,
    searchTerm: encodedSearchTerm,
  });
  const remoteData = (await makeApiCall(apiUrl)) as KlipyResponse;
  // console.log('remoteData: ', remoteData);
  if (remoteData?.data?.data.length) {
    return remoteData.data.data;
  }
  const backupSearchTerm = encodeURIComponent('swedish chef');
  const backupApiUrl = urls.klipyApiSearch({
    apiKey: KLIPY_API_KEY,
    searchTerm: backupSearchTerm,
  });
  // console.log('backupApiUrl: ', backupApiUrl);
  const backupData = (await makeApiCall(backupApiUrl)) as KlipyResponse;
  return backupData.data.data;
};

export const registerKlipyGifShare = async (
  klipyGifObject: { id: string },
  searchTerm: string
): Promise<void> => {
  const KLIPY_API_KEY = process.env.KLIPY_API_KEY!;
  birdLog(`[registerKlipyGifShare] ${searchTerm}`);
  const apiShareUrl = urls.klipyApiShare({
    apiKey: KLIPY_API_KEY,
    gifId: klipyGifObject.id,
    searchTerm: encodeURIComponent(searchTerm),
  });
  // console.log(apiShareUrl);
  await makeApiCall(apiShareUrl, 'POST', null, {
    customer_id: 'put-a-bot-on-it-discord-server',
    q: searchTerm,
  });
};

export const getRandomGifByTerm = async (
  searchTerm: string,
  useDownsized = false
): Promise<string> => {
  const gifs = await getKlipyGifs({ searchTerm });
  const randomNum = getRandomNum(gifs.length);
  return useDownsized
    ? gifs[randomNum].file.md.gif.url
    : gifs[randomNum].file.hd.gif.url;
};

export const generateImageAttachment = async ({
  openai,
  prompt,
  userId,
  options = {},
}: {
  openai: OpenAI;
  prompt: string;
  userId: string;
  options?: Record<string, unknown>;
}): Promise<{ embedFile: AttachmentBuilder; embedImage: string }> => {
  const response = await openai.images.generate({
    prompt,
    n: 1,
    model: 'gpt-image-2',
    size: 'auto',
    ...options,
    user: userId,
  });
  const aiImage = response.data?.[0]?.b64_json ?? '';
  const aiImageName = `${randomUUID()}.png`;
  const embedFile = new AttachmentBuilder(Buffer.from(aiImage, 'base64'), {
    name: aiImageName,
  });
  return { embedFile, embedImage: `attachment://${aiImageName}` };
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
}: {
  embedAuthor?: { name: string };
  embedTitle?: string;
  embedDescription?: string;
  embedImage?: string;
  embedThumbnail?: string;
  embedColor?: string;
  embedUrl?: string;
  embedFooter?: string;
} = {}): EmbedBuilder => {
  const discordEmbed = new EmbedBuilder();

  if (embedAuthor.name.trim().length) {
    discordEmbed.setAuthor(embedAuthor);
  }
  if (embedColor.trim().length) {
    discordEmbed.setColor(embedColor as `#${string}`);
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
}: {
  interaction: ChatInputCommandInteraction;
  content: string;
  reaction?: string | null;
  ttl?: number | null;
  deferred?: boolean;
  ephemeral?: boolean;
}): Promise<void> => {
  try {
    if (deferred) {
      await interaction.editReply({
        content,
        flags: ephemeral ? (MessageFlags.Ephemeral as number) : undefined,
      });
    } else {
      await interaction.reply({
        content,
        flags: ephemeral ? (MessageFlags.Ephemeral as number) : undefined,
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
}: {
  interaction: ChatInputCommandInteraction;
  content: EmbedBuilder;
  file?: AttachmentBuilder | null;
  reaction?: string | string[] | null;
  ttl?: number | null;
  deferred?: boolean;
  ephemeral?: boolean;
}): Promise<void> => {
  try {
    if (deferred) {
      await interaction.editReply({
        embeds: [content],
        files: file ? [file] : (null as unknown as undefined),
        flags: ephemeral ? (MessageFlags.Ephemeral as number) : undefined,
      });
    } else {
      await interaction.reply({
        embeds: [content],
        files: file ? [file] : (null as unknown as undefined),
        flags: ephemeral ? (MessageFlags.Ephemeral as number) : undefined,
      });
    }
    if (reaction) {
      const message = await interaction.fetchReply();
      if (typeof reaction === 'object') {
        for (const emoji of reaction) {
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

export const wait = async (delay = 0): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const filterArrayOfObjects = <T>(
  array: T[],
  field: keyof T,
  value: string
): T[] =>
  array.filter((item) => {
    const fieldValue = item[field];
    if (typeof fieldValue !== 'string') {
      return false;
    }
    return fieldValue.trim().toLowerCase() === value.trim().toLowerCase();
  });

export const sortArrayOfObjects = <T>(arrayToSort: T[], key: keyof T): T[] =>
  arrayToSort.sort((item1, item2) => {
    const value1 = String(item1[key]).toLowerCase();
    const value2 = String(item2[key]).toLowerCase();
    return value1.localeCompare(value2);
  });
