import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import {
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.ts';
import { nasaApi } from '../lib/urls.ts';

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
          { name: 'random', value: 'random' }
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const { NASA_API_KEY } = process.env;
    const apiURLBase = nasaApi(NASA_API_KEY!);
    const isToday = interaction.options.getString('date') === 'today';
    const apiUrlSuffix = isToday ? '' : '&count=50';
    type NasaApod = {
      title: string;
      explanation: string;
      hdurl?: string;
      url: string;
    };
    const apiData = (await makeApiCall(`${apiURLBase}${apiUrlSuffix}`)) as
      | NasaApod
      | NasaApod[];
    const nasaColor = '#113991';
    const nasaData = isToday
      ? (apiData as NasaApod)
      : (apiData as NasaApod[])[getRandomNum((apiData as NasaApod[]).length)];
    const nasaEmbed = prepareEmbed({
      embedColor: nasaColor,
      embedTitle: nasaData.title,
      embedDescription: nasaData.explanation,
      embedUrl: nasaData.hdurl || nasaData.url,
      embedImage: nasaData.url,
    });
    sendEmbed({ interaction, content: nasaEmbed });
  },
};
