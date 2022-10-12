import { SlashCommandBuilder } from 'discord.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { LocalStorage } from 'node-localstorage';

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

import {
  getTenorGifs,
  getRandomNum,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
  birdLog,
} from '../lib/helpers.js';
import { initNationalDayData } from '../lib/national-day.js';

const localStorage = new LocalStorage('/local-storage');
const storageKey = dayjs().tz(defaultTimezone).format('YYYYMMDD');

export default {
  data: new SlashCommandBuilder()
    .setName('national-day')
    .setDescription(
      'Random national day from National Day Calendar (w/ possibly related GIF from Tenor API)',
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const randomColor = getRandomColor();

    let nationalDayData = localStorage.getItem(storageKey);
    if (!nationalDayData) {
      await initNationalDayData();
    }
    nationalDayData = localStorage.getItem(storageKey);
    nationalDayData = JSON.parse(nationalDayData);

    const randomNum = getRandomNum(nationalDayData.length);
    const { title, description, link } = nationalDayData[randomNum];

    let searchTermArray = title.split(' ');
    const startTermsToRemove = ['national', 'international', 'world'];
    if (startTermsToRemove.includes(searchTermArray[0].trim().toLowerCase())) {
      searchTermArray.shift();
    }
    const endTermsToRemove = ['day', 'eve'];
    if (
      endTermsToRemove.includes(
        searchTermArray[searchTermArray.length - 1].trim().toLowerCase(),
      )
    ) {
      searchTermArray.pop();
    }
    const searchTerm = searchTermArray.join(' ').toLowerCase();
    // const nationalDayGifs = await getGiphyGifs({ searchTerm });
    let nationalDayGifs = await getTenorGifs({ searchTerm });
    if (!nationalDayGifs.length) {
      nationalDayGifs = await getTenorGifs({ searchTerm: 'swedish chef' });
    }
    const randomGifNum = getRandomNum(nationalDayGifs.length);
    // const randomGif = nationalDayGifs[randomGifNum].images.original.url;
    const randomGif = nationalDayGifs[randomGifNum].media_formats.gif.url;
    const nationalDayEmbed = prepareEmbed({
      embedTitle: title,
      embedColor: randomColor,
      embedDescription: `${description} [Read More](${link})`,
      embedImage: randomGif,
      embedUrl: link,
    });
    birdLog(title);
    return sendEmbed({
      interaction,
      content: nationalDayEmbed,
      reaction: '📅',
    });
  },
};
