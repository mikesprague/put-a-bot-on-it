import { SlashCommandBuilder } from '@discordjs/builders';
import {
  getRandomColor,
  getRandomGifByTerm,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { thisForThatApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('startup')
    .setDescription('Random idea for a Startup from an API with a random GIF'),
  async execute(interaction) {
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
    return sendEmbed(interaction, startupEmbed);
  },
};
