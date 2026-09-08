import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import {
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.ts';
import { xkcdApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('xkcd')
    .setDescription('Get current or random XKCD comic')
    .addStringOption((option) =>
      option
        .setName('comic')
        .setDescription('Latest or random')
        .setRequired(true)
        .addChoices(
          { name: 'latest', value: 'latest' },
          { name: 'random', value: 'random' }
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const isCurrent = interaction.options.getString('comic') === 'latest';
    const randomComicNum = getRandomNum(2430);
    const apiUrl = isCurrent ? xkcdApi() : xkcdApi(randomComicNum);
    const apiData = (await makeApiCall(apiUrl)) as {
      title: string;
      num: number;
      alt: string;
      img: string;
    };

    const xkcdEmbed = prepareEmbed({
      embedTitle: apiData.title,
      embedUrl: `https://xkcd.com/${apiData.num}`,
      embedFooter: apiData.alt,
      embedImage: apiData.img,
    });
    sendEmbed({ interaction, content: xkcdEmbed });
  },
};
