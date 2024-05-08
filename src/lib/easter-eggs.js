import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

import {
  getRandomGifByTerm,
  getRandomNum,
  messageIncludesWords,
  normalizeMsgContent,
} from './helpers.js';
import { insultStrings } from './lists.js';

const initMiddleFinger = async (msg) => {
  if (msg.author.bot) {
    return;
  }
  if (insultStrings.includes(normalizeMsgContent(msg))) {
    const middleFInger = await getRandomGifByTerm('middle finger', false);
    msg.channel.send({ content: middleFInger });
  }
};

const initCate = (msg) => {
  if (msg.author.bot) {
    return;
  }
  const cateWords = ['architect', 'toilet beam'];
  if (messageIncludesWords(msg, cateWords)) {
    msg.channel.send({
      content: 'https://giphy.com/gifs/funny-work-architect-CbSGut2wzWKZy',
    });
  }
};

const initBurger = (msg) => {
  if (msg.author.bot) {
    return;
  }
  const burgerWords = ['five guys', 'fat guys', 'burger'];
  if (
    messageIncludesWords(msg, burgerWords) &&
    !msg.content.toLowerCase().includes('no burger')
  ) {
    msg.channel.send({
      content: 'https://tenor.com/MDyi.gif',
    });
  }
  if (messageIncludesWords(msg, ['no burger'])) {
    msg.channel.send({
      content: 'https://tenor.com/bpvcT.gif',
    });
  }
};

const initTaco = (msg) => {
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
    msg.channel.send({
      content: 'https://tenor.com/blAbF.gif',
    });
  }
};

const initMoist = (msg) => {
  if (msg.author.bot) {
    return;
  }
  const moistGifs = [
    'https://tenor.com/bLkTB.gif',
    'https://tenor.com/tWVU.gif',
    'https://tenor.com/bzkJe.gif',
    'https://tenor.com/MSHZ.gif',
    'https://tenor.com/bP76J.gif',
  ];
  const moistWords = ['moist'];
  const moistGif = moistGifs[getRandomNum(moistGifs.length)];

  if (messageIncludesWords(msg, moistWords)) {
    msg.channel.send({
      content: moistGif,
    });
  }
};

const initJava = (msg) => {
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
  ];

  if (messageIncludesWords(msg, javaWords)) {
    msg.channel.send({
      content: 'https://tenor.com/bxOgD.gif',
    });
  }
};

export const initEasterEggs = async (msg) => {
  await initMiddleFinger(msg);
  initCate(msg);
  initBurger(msg);
  initTaco(msg);
  initJava(msg);
  initMoist(msg);
};
