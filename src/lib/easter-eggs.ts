import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

import type { Message, TextChannel } from 'discord.js';

import {
  getRandomGifByTerm,
  getRandomNum,
  messageIncludesWords,
  normalizeMsgContent,
} from './helpers.ts';
import { insultStrings } from './lists.ts';

const sendReply = async (msg: Message, content: string): Promise<void> => {
  await (msg.channel as TextChannel).send({ content });
};

const initMiddleFinger = async (msg: Message): Promise<void> => {
  if (msg.author.bot) {
    return;
  }
  if (insultStrings.includes(normalizeMsgContent(msg))) {
    const middleFInger = await getRandomGifByTerm('middle finger', false);
    void sendReply(msg, middleFInger);
  }
};

const initCate = (msg: Message): void => {
  if (msg.author.bot) {
    return;
  }
  const cateWords = ['architect', 'toilet beam'];
  if (messageIncludesWords(msg, cateWords)) {
    sendReply(msg, 'https://giphy.com/gifs/funny-work-architect-CbSGut2wzWKZy');
  }
};

const initBurger = (msg: Message): void => {
  if (msg.author.bot) {
    return;
  }
  const burgerWords = ['five guys', 'fat guys', 'burger'];
  if (
    messageIncludesWords(msg, burgerWords) &&
    !msg.content.toLowerCase().includes('no burger')
  ) {
    sendReply(msg, 'https://tenor.com/MDyi.gif');
  }
  if (messageIncludesWords(msg, ['no burger'])) {
    sendReply(msg, 'https://tenor.com/bpvcT.gif');
  }
};

const initTaco = (msg: Message): void => {
  if (msg.author.bot) {
    return;
  }
  const tacoWords = [
    'i could go for tacos',
    'i would eat tacos',
    'taco tuesday',
    'i want tacos',
    'tacos sound good',
  ];

  if (messageIncludesWords(msg, tacoWords)) {
    sendReply(msg, 'https://tenor.com/blAbF.gif');
  }
};

const initMoist = (msg: Message): void => {
  if (msg.author.bot) {
    return;
  }
  const moistGifs = [
    'https://static2.klipy.com/ii/d7aec6f6f171607374b2065c836f92f4/12/83/hkzSEuD7.gif',
    'https://static2.klipy.com/ii/935d7ab9d8c6202580a668421940ec81/80/96/NFw53B4f.gif',
    'https://static2.klipy.com/ii/e293a233a303a98e471f78d04e13a1b0/19/4a/DSOq1kC0.gif',
    'https://static2.klipy.com/ii/d6b0ce929193df3c242ac34b5654d2ce/f8/25/b2iqL2q7.gif',
    'https://static2.klipy.com/ii/e293a233a303a98e471f78d04e13a1b0/4a/c9/tNhTdT2j.gif',
    'https://static2.klipy.com/ii/e293a233a303a98e471f78d04e13a1b0/d1/2e/9v4LcbNg.gif',
    'https://static2.klipy.com/ii/8ce8357c78ea940b9c2015daf05ce1a5/1d/a6/3hiS2Pgi.gif',
    'https://static2.klipy.com/ii/4493325008d34b7bf8cd6813cd5c1619/ea/63/Vk9UtuRt3NKoD8yaW.gif',
    'https://static2.klipy.com/ii/a15b48460c436e1e92c85ffc680932cc/0a/e5/JeQST9ma.gif',
    'https://static2.klipy.com/ii/c3a19a0b747a76e98651f2b9a3cca5ff/a2/ac/OBx6srF8.gif',
  ];
  const moistWords = ['moist'];
  const moistGif = moistGifs[getRandomNum(moistGifs.length)];

  if (messageIncludesWords(msg, moistWords)) {
    sendReply(msg, moistGif);
  }
};

const initJava = (msg: Message): void => {
  if (msg.author.bot) {
    return;
  }
  const javaWords = [
    'java',
    'js',
    'javascript',
    'java script',
    'java-script',
    'react',
    'angular',
    'vue',
    'node',
    'node.js',
    'nodejs',
    'bun',
    'deno',
    'typescript',
  ];

  if (messageIncludesWords(msg, javaWords)) {
    sendReply(msg, 'https://tenor.com/bxOgD.gif');
  }
};

export const initEasterEggs = async (msg: Message): Promise<void> => {
  await initMiddleFinger(msg);
  initCate(msg);
  initBurger(msg);
  initTaco(msg);
  initJava(msg);
  initMoist(msg);
};
