import { SlashCommandBuilder } from 'discord.js';

import {
  getTenorGifs,
  getRandomNum,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
  birdLog,
} from '../lib/helpers.js';
import {
  initNationalDayData,
  clearNationDayData,
} from '../lib/national-day.js';

const getChoices = async () => {
  clearNationDayData();
  const nationalDayData = await initNationalDayData();
  let choices = [];
  let idx = 0;
  for (const day of nationalDayData) {
    const item = {
      name: day.title,
      value: `${idx}`,
    };
    idx++;
    choices.push(item);
  }
  return choices;
};

const choices = await getChoices();

export default {
  data: new SlashCommandBuilder()
    .setName('national-day')
    .setDescription(
      'Random national day from National Day Calendar (w/ possibly related GIF from Tenor API)',
    )
    .addStringOption((option) =>
      option
        .setName('day')
        .setDescription('day')
        .setRequired(true)
        .addChoices(...choices),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const randomColor = getRandomColor();
    const nationalDayData = await initNationalDayData();
    // const randomNum = getRandomNum(nationalDayData.length);
    const day = Number(interaction.options.getString('day'));
    const { title, description, link } = nationalDayData[day];

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
    birdLog(`[/national-day] ${title}`);
    return sendEmbed({
      interaction,
      content: nationalDayEmbed,
      reaction: '📅',
    });
  },
};
