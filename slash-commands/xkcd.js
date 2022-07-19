import { SlashCommandBuilder } from 'discord.js';
import {
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { xkcdApi } from '../lib/urls.js';

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
          { name: 'random', value: 'random' },
        ),
    ),
  async execute(interaction) {
    const isCurrent = interaction.options.getString('comic') === 'latest';
    const randomComicNum = getRandomNum(2430);
    const apiUrl = isCurrent ? xkcdApi() : xkcdApi(randomComicNum);
    const apiData = await makeApiCall(apiUrl);

    const xkcdEmbed = prepareEmbed({
      embedTitle: apiData.title,
      embedUrl: `https://xkcd.com/${apiData.num}`,
      embedFooter: apiData.alt,
      embedImage: apiData.img,
    });
    sendEmbed(interaction, xkcdEmbed);
  },
};
