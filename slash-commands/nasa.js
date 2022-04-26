import { SlashCommandBuilder } from '@discordjs/builders';
import {
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { nasaApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nasa')
    .setDescription('Get current or random NASA media of the day')
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription('Today or random')
        .setRequired(true)
        .addChoices(
          { name: 'today', value: 'today' },
          { name: 'random', value: 'random' },
        ),
    ),
  async execute(interaction) {
    const { NASA_API_KEY } = process.env;
    const apiURLBase = nasaApi(NASA_API_KEY);
    const isToday = interaction.options.getString('date') === 'today';
    const apiUrlSuffix = isToday ? '' : '&count=50';
    const apiData = await makeApiCall(`${apiURLBase}${apiUrlSuffix}`);
    const randomNum = getRandomNum(apiData.length);
    const nasaColor = '#113991';
    const nasaData = isToday ? apiData : apiData[randomNum];
    const nasaEmbed = prepareEmbed({
      embedColor: nasaColor,
      embedTitle: nasaData.title,
      embedDescription: nasaData.explanation,
      embedUrl: nasaData.hdurl || nasaData.url,
      embedImage: nasaData.url,
    });
    sendEmbed(interaction, nasaEmbed);
  },
};
