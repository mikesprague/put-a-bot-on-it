import { SlashCommandBuilder } from 'discord.js';
import {
  getRandomColor,
  getRandomGifByTerm,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
  getCustomEmojiCode,
} from '../lib/helpers.js';
import { trumpApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('trump')
    .setDescription('Random Trump quote from an API with a random GIF'),
  async execute(interaction) {
    await interaction.deferReply();
    const apiUrl = trumpApi();
    const apiData = await makeApiCall(apiUrl);
    const topicGif = await getRandomGifByTerm(apiData.tags[0], false);
    const randomColor = getRandomColor();
    const trumpQuote = apiData.value;
    const trumpEmoji = getCustomEmojiCode('trumphair');
    const trumpQuoteEmbed = prepareEmbed({
      embedDescription: trumpQuote,
      embedImage: topicGif,
      embedColor: randomColor,
    });
    return sendEmbed({
      interaction,
      content: trumpQuoteEmbed,
      reaction: trumpEmoji,
    });
  },
};
