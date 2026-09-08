import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import {
  getRandomColor,
  getRandomGifByTerm,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.ts';
import { thisForThatApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('startup')
    .setDescription('Random idea for a Startup from an API with a random GIF'),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const apiUrl = thisForThatApi();
    const apiData = await makeApiCall(apiUrl);
    const topicGif = await getRandomGifByTerm(apiData.that, false);
    const randomColor = getRandomColor();
    const startupIdea = `${apiData.this} for ${apiData.that}`;
    const startupEmbed = prepareEmbed({
      embedTitle: startupIdea,
      embedImage: topicGif,
      embedColor: randomColor,
    });
    return sendEmbed({ interaction, content: startupEmbed });
  },
};
